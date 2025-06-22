import { AudioPlayerStatus } from '@discordjs/voice';
import { createAudioStreamFromUrl } from '../utils/audioStream.js';

const activeConnections = new Map();
const playerStates = new Map();

export function isPlaying(guildId) {
  return activeConnections.has(guildId);
}

export function getVoiceChannelId(guildId) {
  const connection = activeConnections.get(guildId);
  return connection?.joinConfig?.channelId;
}

export async function handlePlayerConnection(guildId, connection, player, audioUrl, repeatCount = 1) {
  if (activeConnections.has(guildId)) {
    const oldConnection = activeConnections.get(guildId);
    oldConnection.destroy();
  }

  activeConnections.set(guildId, connection);
  playerStates.set(guildId, {
    currentRepeat: 1,
    maxRepeats: repeatCount,
    audioUrl
  });

  player.on(AudioPlayerStatus.Idle, async () => {
    const state = playerStates.get(guildId);
    if (state && state.currentRepeat < state.maxRepeats) {
      try {
        const resource = await createAudioStreamFromUrl(state.audioUrl);
        state.currentRepeat++;
        player.play(resource);
      } catch (error) {
        console.error('Error creating new audio stream:', error);
        cleanup(guildId);
      }
    } else {
      cleanup(guildId);
    }
  });

  player.on('error', error => {
    console.error('Player error:', error);
    cleanup(guildId);
  });
}

function cleanup(guildId) {
  if (activeConnections.has(guildId)) {
    const connection = activeConnections.get(guildId);
    connection.destroy();
    activeConnections.delete(guildId);
  }
  playerStates.delete(guildId);
}
//loqmanas (l.q1)