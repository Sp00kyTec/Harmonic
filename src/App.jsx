// src/App.jsx
import Header from './components/Header';
import Player from './components/Player';
import TrackList from './components/TrackList';

function App() {
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