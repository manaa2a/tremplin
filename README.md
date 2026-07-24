# Tremplin

Web app **mobile-first** de pilotage de recherche d'emploi (métiers de la logistique autour d'Orly).
Implémentée en **React + TypeScript + Vite** d'après le handoff design `design_handoff_tremplin`
(design system **Modernist** : rouge `#ec3013` sur fond `#f3f2f2`, police Archivo, rayon 0 partout,
règles 2px, tout aligné à gauche).

## Lancer en local

```bash
./dev.sh          # sert sur http://localhost:5173 (utilise le Node portable)
```

ou, si `node`/`npm` sont dans le PATH :

```bash
npm install
npm run dev
npm run build     # typecheck (tsc) + build de prod dans dist/
```

## Déploiement (Vercel)

L'app se déploie sur **Vercel** : le front (statique, `dist/`) + le proxy France Travail
en **fonction serverless** (`api/france-travail/search.ts`, même cœur que le proxy dev).

### Option A — via GitHub (recommandé)

1. Pousse le dossier `tremplin/` sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com) → **New Project** → importe le dépôt.
   - Si `tremplin/` n'est pas la racine du dépôt, règle **Root Directory** = `tremplin`.
   - Framework détecté : **Vite** (build `npm run build`, output `dist`).
3. **Settings → Environment Variables**, ajoute (Production + Preview) :
   - `FRANCE_TRAVAIL_CLIENT_ID`
   - `FRANCE_TRAVAIL_CLIENT_SECRET`
4. **Deploy** → tu obtiens une URL `https://tremplin-xxx.vercel.app`.
5. Reporte cette URL dans le champ « URL de votre site » de ton application France Travail.

### Option B — via la CLI

```bash
cd tremplin
npx vercel                              # login + link + déploiement preview
npx vercel env add FRANCE_TRAVAIL_CLIENT_ID       # colle la valeur, choisis Production
npx vercel env add FRANCE_TRAVAIL_CLIENT_SECRET
npx vercel --prod                       # déploiement production
```

L'utilisateur externe ouvre l'URL sur son téléphone et peut l'**ajouter à l'écran d'accueil**
(manifest + icône fournis) — elle se comporte alors comme une app installée, plein écran.

## Persistance (localStorage)

Les données de l'utilisateur (candidatures, statuts, historique, offres enregistrées, rayon
préféré) sont stockées sur **son appareil** via `localStorage` (`src/lib/persist.ts`) — pas de
backend, pas de compte. Elles survivent aux rafraîchissements et à l'« ajout à l'écran d'accueil ».
La clé est versionnée (`tremplin.v1`) ; l'état transitoire (écran courant, toasts, modale) n'est
pas persisté, et les offres sont toujours rechargées en direct.

> L'app démarre pré-remplie avec 7 candidatures de démo (pour montrer les fonctionnalités).
> Pour un démarrage vierge (données réelles de l'utilisateur uniquement), il suffit de vider
> `MOCK_APPS` dans `src/data/mock.ts`.

## Écrans (6 + modale)

| Écran | Fichier | Contenu |
|-------|---------|---------|
| Connexion | `src/screens/Login.tsx` | Auth mockée (n'importe quel clic connecte) |
| Accueil | `src/screens/Dashboard.tsx` | Stats 2×2, « à relancer aujourd'hui », prochains entretiens |
| Suivi | `src/screens/Suivi.tsx` | Liste filtrable des candidatures, chips + compteurs, tri par priorité |
| Détail | `src/screens/Detail.tsx` | Infos poste, contact, sélecteur de statut, historique |
| Offres | `src/screens/Offres.tsx` | Recherche, slider de rayon, **carte / liste** |
| Profil | `src/screens/Profil.tsx` | Identité + préférences de recherche |
| Modale relance | `src/components/RelanceModal.tsx` | Bottom-sheet, message auto pré-rempli et éditable |

## État

Tout l'état vit dans un `useReducer` unique (`src/store.tsx`) — screen, tab, filtres,
distance, offres enregistrées, statuts, toasts, modale de relance. La logique reproduit
fidèlement celle du prototype (`renderVals` / `Component`), y compris :

- **Relance en 1 clic** : ouvre un message pré-rempli (template dans `relanceTemplate`),
  l'envoi fait passer le statut à `postulé`, journalise l'historique et affiche un toast.
- **Enregistrer une offre** : l'ajoute au suivi avec le statut `à postuler`.
- **Slider de rayon** : recalcule en direct les offres dans le rayon, l'anneau de la carte
  et l'atténuation des cartes en vue liste.

## Carte

`src/components/MapView.tsx` remplace le placeholder SVG du prototype par une **vraie carte
Leaflet** (react-leaflet) centrée sur Orly :
- fond CartoDB « light » (atténué en niveaux de gris via CSS),
- **anneau de rayon réel** (`Circle`, rayon = distance × 1000 m, pointillés accent),
- marqueur maison carré au centre + épingles offres carrées (accent si dans le rayon, gris sinon),
- clic sur une épingle → carte popup en bas.

Les coordonnées lat/lng des offres sont dans `src/data/mock.ts` (villes réelles autour d'Orly).

## API France Travail (branchée)

Les offres de l'écran **Offres** viennent de l'API **« Offres d'emploi v2 » de France Travail**,
via un proxy serveur (le secret OAuth ne transite jamais par le navigateur — l'API bloque
d'ailleurs les appels cross-origin).

### Activer les données en direct

1. Crée un compte développeur sur **https://francetravail.io**.
2. Crée une application, abonne-la à l'API **« Offres d'emploi v2 »** → tu obtiens un
   `client_id` et un `client_secret`.
3. `cp .env.example .env` puis colle tes identifiants dans `.env`.
4. Relance `./dev.sh`. Au démarrage, le log affiche `France Travail proxy: configured`.

Sans identifiants, l'app **retombe automatiquement sur les offres de démo** (badge « Démo »
sur l'écran Offres). Avec identifiants, le badge passe à « France Travail » et la recherche
est en direct (mots-clés + rayon depuis Orly, commune INSEE 94054).

### Architecture

| Couche | Fichier | Rôle |
|--------|---------|------|
| Proxy (cœur) | `src/server/franceTravail.ts` | OAuth client-credentials + cache token + appel search. Réutilisable en serverless. |
| Proxy (dev) | `vite-plugins/france-travail.ts` | Expose `GET /api/france-travail/search` sur le serveur Vite. |
| Service client | `src/services/franceTravail.ts` | Appelle le proxy, mappe la réponse FT → `Offer`, calcule la distance (Haversine), repli mock. |
| Écran | `src/screens/Offres.tsx` | Fetch au montage + recherche débouncée, états chargement / vide / source. |

**Passage en production** : `searchOffers()` de `src/server/franceTravail.ts` est
framework-agnostique — il suffit de l'appeler depuis une fonction serverless
(`/api/france-travail/search`) au lieu du middleware Vite ; le contrat côté navigateur
est identique.

## Autres points de branchement prod

Le reste des mocks est isolé dans `src/data/mock.ts` :

- **Candidatures** → même schéma que `Offer` ; à brancher sur une persistance backend.
- **Envoi des relances** → `mailto:` (déjà câblé, commenté dans `RelanceModal.tsx`) ou API e-mail.
- **Auth + persistance** → aucun appel réseau pour l'instant ; l'état est en mémoire.

## Design system

`src/styles/modernist.css` reprend les tokens Modernist (couleurs, ramps neutre/accent, typo,
espacements, ombres) ; `src/styles/app.css` porte la coquille d'app (status bar, nav, toast,
slider, bottom-sheet, carte). `src/lib/status.ts` centralise la palette des 7 statuts.
