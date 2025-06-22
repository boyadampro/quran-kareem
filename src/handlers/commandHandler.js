import { REST, Routes } from 'discord.js';
import { config } from '../config/config.js';
import { commands } from '../commands/commands.js';

const rest = new REST({ version: '10' }).setToken(config.discord.token);

export async function deployCommands() {
  try {
    await rest.put(
      Routes.applicationCommands(config.discord.clientId),
      { body: commands }
    );
    console.log('Slash commands registered successfully');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
    throw error;
  }
}

//loqmanas (l.q1)