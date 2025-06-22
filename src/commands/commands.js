import { SlashCommandBuilder } from 'discord.js';
import { SURAH_CATEGORIES } from '../constants/categories.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join a voice channel'),
  
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a Quran surah')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Select surah category')
        .setRequired(true)
        .addChoices(...Object.entries(SURAH_CATEGORIES).map(([key, value]) => ({
          name: value.name,
          value: key
        })))
    )
    .addStringOption(option =>
      option
        .setName('surah')
        .setDescription('Select a surah')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption(option =>
      option
        .setName('repeat')
        .setDescription('Number of times to repeat (max 10)')
        .setMinValue(1)
        .setMaxValue(10)
    )
];

//loqmanas (l.q1)