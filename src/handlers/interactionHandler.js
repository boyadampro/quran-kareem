import { surahs } from '../data/surahs.js';
import { joinChannel, playSurah } from '../utils/voice.js';
import { handlePlayerConnection, isPlaying, getVoiceChannelId } from './playerManager.js';
import { SURAH_CATEGORIES } from '../constants/categories.js';

function getSurahsByCategory(category) {
  const categoryConfig = SURAH_CATEGORIES[category];
  if (!categoryConfig) return [];

  if (categoryConfig.range) {
    const [start, end] = categoryConfig.range;
    return surahs.filter(surah => surah.number >= start && surah.number <= end);
  }

  if (categoryConfig.surahs) {
    return surahs.filter(surah => categoryConfig.surahs.includes(surah.number));
  }

  return [];
}

export async function handleAutocomplete(interaction) {
  if (interaction.commandName === 'play') {
    const category = interaction.options.getString('category');
    const focusedValue = interaction.options.getFocused().toLowerCase();
    
    const categorySurahs = getSurahsByCategory(category);
    const filtered = categorySurahs
      .filter(surah => 
        surah.name.toLowerCase().includes(focusedValue) || 
        surah.arabicName.includes(focusedValue) ||
        surah.number.toString().includes(focusedValue)
      )
      .slice(0, 25)
      .map(surah => ({
        name: `${surah.number}. ${surah.arabicName} (${surah.name})`,
        value: surah.name
      }));

    await interaction.respond(filtered);
  }
}

export async function handleCommand(interaction) {
  const { commandName, guildId } = interaction;

  try {
    if (commandName === 'join') {
      await joinChannel(interaction);
      await interaction.reply('Joined the voice channel!');
    }

    if (commandName === 'play') {
      const memberVoiceChannel = interaction.member.voice.channel;
      if (!memberVoiceChannel) {
        return interaction.reply('يجب عليك الانضمام إلى غرفة صوتية أولاً!');
      }

      if (isPlaying(guildId)) {
        const currentChannelId = getVoiceChannelId(guildId);
        if (currentChannelId !== memberVoiceChannel.id) {
          return interaction.reply('البوت مشغول حالياً في غرفة أخرى!');
        }
      }

      const surahName = interaction.options.getString('surah');
      const repeatCount = interaction.options.getInteger('repeat') || 1;
      const surah = surahs.find(s => s.name === surahName);

      if (!surah) {
        return interaction.reply('لم يتم العثور على السورة.');
      }

      await interaction.deferReply();
      const connection = await joinChannel(interaction);
      const player = await playSurah(connection, surah.url);
      
      await handlePlayerConnection(guildId, connection, player, surah.url, repeatCount);
      
      const repeatMsg = repeatCount > 1 ? ` (تكرار ${repeatCount} مرات)` : '';
      await interaction.editReply(`جاري تشغيل ${surah.arabicName} (${surah.name})${repeatMsg}`);
    }
  } catch (error) {
    console.error('Command execution failed:', error);
    const reply = interaction.deferred ? interaction.editReply : interaction.reply;
    await reply.call(interaction, error.message || 'حدث خطأ أثناء تنفيذ الأمر.');
  }
}