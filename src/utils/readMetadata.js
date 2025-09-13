// src/utils/readMetadata.js
import { parseBlob } from 'music-metadata-browser';

export const readAudioMetadata = async (file) => {
  try {
    const metadata = await parseBlob(file);

    let coverUrl = null;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      const blob = new Blob([picture.data], { type: picture.format });
      coverUrl = URL.createObjectURL(blob);
    }

    return {
      title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      cover: coverUrl || '/covers/placeholder.jpg',
      file: URL.createObjectURL(file),
      duration: metadata.format.duration
        ? `${Math.floor(metadata.format.duration / 60)}:${Math.floor(metadata.format.duration % 60)
            .toString()
            .padStart(2, '0')}`
        : 'N/A',
    };
  } catch (error) {
    console.error("Error reading metadata:", error);
    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      cover: '/covers/placeholder.jpg',
      file: URL.createObjectURL(file),
      duration: 'N/A',
    };
  }
};