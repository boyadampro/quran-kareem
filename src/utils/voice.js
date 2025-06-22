import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } from '@discordjs/voice';
import { createAudioStreamFromUrl } from './audioStream.js';

export async function joinChannel(interaction) {
  const voiceChannel = interaction.member.voice.channel;
  
  if (!voiceChannel) {
    throw new Error('Please join a voice channel first!');
  }

  return joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
    selfDeaf: true
  });
}

export async function playSurah(connection, url) {
  try {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      }
    });

    const resource = await createAudioStreamFromUrl(url);
    resource.volume?.setVolume(1);

    connection.subscribe(player);
    
    return new Promise((resolve, reject) => {
      player.once(AudioPlayerStatus.Playing, () => resolve(player));
      player.once('error', reject);
      player.play(resource);
    });
  } catch (error) {
    console.error('Error playing surah:', error);
    throw new Error('Failed to play the surah. Please try again.');
  }
}


//loqmanas (l.q1)