import { useAppState } from './store';
import { StatusBar } from './components/StatusBar';
import { TabBar } from './components/TabBar';
import { Toast } from './components/Toast';
import { RelanceModal } from './components/RelanceModal';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { Suivi } from './screens/Suivi';
import { Detail } from './screens/Detail';
import { Offres } from './screens/Offres';
import { Profil } from './screens/Profil';

function CurrentScreen() {
  const { screen, tab, detailId } = useAppState();

  if (screen === 'login') return <Login />;
  if (detailId) return <Detail />;

  switch (tab) {
    case 'dashboard': return <Dashboard />;
    case 'apps': return <Suivi />;
    case 'search': return <Offres />;
    case 'profile': return <Profil />;
  }
}

export default function App() {
  const { screen } = useAppState();

  return (
    <>
      <StatusBar />
      <div className="vp">
        <CurrentScreen />
      </div>
      {screen === 'app' && <TabBar />}
      <Toast />
      <RelanceModal />
    </>
  );
}
