// src/components/TrackList.jsx
import songs from '../data/songs.json';
import audioManager from '../utils/audioManager';

function TrackList() {
  const handlePlay = (song) => {
    audioManager.load(song);
    audioManager.play();
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mt-4 shadow">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Your Library</h2>
      <ul>
        {songs.map((song) => (
          <li
            key={song.id}
            onClick={() => handlePlay(song)}
            className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer transition"
          >
            <img
              src={song.cover || "/covers/placeholder.jpg"}
              alt={song.title}
              className="w-12 h-12 rounded shadow"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{song.title}</p>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>
            <span className="text-sm text-gray-500 w-10">{song.duration}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackList;