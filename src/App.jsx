// src/App.jsx
import { useEffect } from 'react';
import Header from './components/Header';
import Player from './components/Player';
import TrackList from './components/TrackList';
import audioManager from './utils/audioManager';

function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent conflicts with input fields
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Prevent page scroll
          audioManager.togglePlayPause();
          break;

        case 'ArrowRight':
          e.preventDefault();
          audioManager.next();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          audioManager.previous();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Header />
      
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <TrackList />
        </div>

        <div className="md:col-span-2">
          <Player />
        </div>
      </main>

      <footer className="text-center py-6 text-gray-600 text-sm">
        Harmonic • Made with ❤️ from scratch
      </footer>
    </div>
  );
}

export default App;