// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import Player from './components/Player';
import TrackList from './components/TrackList';

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  const handlePlay = (song) => {
    setCurrentSong(song);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Header />
      
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <TrackList onPlay={handlePlay} />
        </div>

        <div className="md:col-span-2">
          <Player currentSong={currentSong} />
        </div>
      </main>

      <footer className="text-center py-6 text-gray-600 text-sm">
        Harmonic • Made with ❤️ from scratch
      </footer>
    </div>
  );
}

export default App;