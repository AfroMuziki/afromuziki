// frontend/src/components/layout/AppShell/AppShell.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import { Footer } from '../Footer/Footer';
import { AudioPlayer } from '../../media/AudioPlayer/AudioPlayer';
import { usePlayerStore } from '../../../store/playerStore';

export const AppShell = () => {
  const { currentTrack } = usePlayerStore();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      {currentTrack && <AudioPlayer />}
    </div>
  );
};
