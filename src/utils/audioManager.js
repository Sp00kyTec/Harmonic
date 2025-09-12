// src/utils/audioManager.js

class AudioManager {
  constructor() {
    this.audio = new Audio();
    this.currentSong = null;
    this.subscribers = [];
  }

  // Subscribe to audio events (play, pause, timeupdate, etc.)
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== callback);
    };
  }

  // Notify all subscribers of state change
  notify() {
    const state = {
      currentSong: this.currentSong,
      isPlaying: !this.audio.paused,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration,
    };
    this.subscribers.forEach(callback => callback(state));
  }

  // Load a new song
  load(song) {
    if (!song) return;
    this.currentSong = song;
    this.audio.src = song.file;
    this.audio.load();
    this.notify();
  }

  // Play the loaded song
  play() {
    this.audio.play().catch(e => console.error("Playback failed:", e));
    this.notify();
  }

  // Pause playback
  pause() {
    this.audio.pause();
    this.notify();
  }

  // Toggle play/pause
  togglePlayPause() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  // Seek to time in seconds
  seek(time) {
    this.audio.currentTime = time;
    this.notify();
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  // Initialize event listeners
  initEvents() {
    this.audio.addEventListener('timeupdate', () => this.notify());
    this.audio.addEventListener('play', () => this.notify());
    this.audio.addEventListener('pause', () => this.notify());
    this.audio.addEventListener('ended', () => {
      console.log("Song ended");
      // Later: auto-play next song
      this.notify();
    });
  }
}

// Create single instance
const audioManager = new AudioManager();
audioManager.initEvents();

export default audioManager;