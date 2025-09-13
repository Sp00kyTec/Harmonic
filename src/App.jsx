// src/App.jsx
import { useEffect } from 'react';
import Header from './components/Header';
import Player from './components/Player';
import TrackList from './components/TrackList';
import audioManager from './utils/audioManager';

function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex flex-col max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <header className="shrink-0 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="px-6 py-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              🎧 Harmonic
            </h1>
            <p className="text-sm opacity-80 mt-1">Your music, elevated.</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Library Sidebar */}
          <aside className="lg:col-span-1">
            <TrackList />
          </aside>

          {/* Player Section */}
          <section className="lg:col-span-2">
            <Player />
          </section>
        </main>

        {/* Footer (Subtle) */}
        <footer className="shrink-0 text-center py-3 text-xs opacity-60 border-t border-white/10 bg-black/10">
          Made with passion • Built from scratch
        </footer>
      </div>
    </div>
  );
}

export default App;