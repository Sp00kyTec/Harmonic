// src/components/TrackList.jsx
import { useEffect, useState } from 'react';
import audioManager from '../utils/audioManager';

function TrackList() {
  const [state, setState] = useState({
    currentSong: null,
  });

  // Subscribe to audio manager for updates
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((newState) => {
      setState({ currentSong: newState.currentSong });
    });

    return () => unsubscribe();
  }, []);

  const handlePlay = (song) => {
    // If same song is clicked, toggle play/pause
    if (audioManager.currentSong() === song) {
      audioManager.togglePlayPause();
    } else {
      // Play new song
      const index = audioManager.songs.findIndex(s => s.id === song.id);
      audioManager.playAtIndex(index);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mt-4 shadow">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Your Library</h2>
      <ul>
        {audioManager.songs.map((song) => {
          const isPlaying = state.currentSong?.id === song.id;
          const isPaused = isPlaying && !audioManager.isPlaying;

          return (
            <li
              key={song.id}
              onClick={() => handlePlay(song)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                isPlaying
                  ? 'bg-green-50 ring-2 ring-green-200'
                  : 'hover:bg-gray-200'
              }`}
            >
              {/* Now Playing Indicator */}
              <div className="relative">
                <img
                  src={song.cover || "/covers/placeholder.jpg"}
                  alt={song.title}
                  className="w-12 h-12 rounded shadow"
                />
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping"></div>
                )}
                {isPlaying && !isPaused && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">▶</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isPlaying ? 'text-green-700' : 'text-gray-900'
                  }`}
                >
                  {song.title}
                </p>
                <p
                  className={`text-sm ${
                    isPlaying ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {song.artist}
                </p>
              </div>

              <span
                className={`text-sm w-10 ${
                  isPlaying ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {song.duration}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TrackList;