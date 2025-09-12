// src/components/TrackList.jsx
import { useEffect, useState } from 'react';
import audioManager from '../utils/audioManager';

function TrackList() {
  const [state, setState] = useState({
    currentSong: null,
  });

  // All songs from audioManager
  const allSongs = audioManager.songs;

  // Local state for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter songs based on search query
  const filteredSongs = allSongs.filter((song) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query)
    );
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
      const index = allSongs.findIndex(s => s.id === song.id);
      audioManager.playAtIndex(index);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mt-4 shadow">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search songs, artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 placeholder-gray-500"
          aria-label="Search songs"
        />
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredSongs.length} result(s)
          </p>
        )}
      </div>

      {/* Song List */}
      <ul className="space-y-1">
        {filteredSongs.length === 0 ? (
          <li className="text-center py-6 text-gray-500">
            No songs match "{searchQuery}"
          </li>
        ) : (
          filteredSongs.map((song) => {
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
                {/* Album Art with Now Playing Indicator */}
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

                {/* Song Info */}
                <div className="flex-1">
                  <p
                    className={`font-medium truncate max-w-[180px] ${
                      isPlaying ? 'text-green-700' : 'text-gray-900'
                    }`}
                  >
                    {song.title}
                  </p>
                  <p
                    className={`text-sm truncate max-w-[180px] ${
                      isPlaying ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {song.artist}
                  </p>
                </div>

                {/* Duration */}
                <span
                  className={`text-sm w-10 ${
                    isPlaying ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {song.duration}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default TrackList;