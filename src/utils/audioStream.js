import { createAudioResource, StreamType } from '@discordjs/voice';
import { Readable } from 'stream';
import { fetch } from 'undici';

export async function createAudioStreamFromUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const stream = Readable.from(buffer);

    return createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true
    });
  } catch (error) {
    console.error('Error creating audio stream:', error);
    throw new Error('Failed to create audio stream');
  }
}

//loqmanas (l.q1)
//free gaza