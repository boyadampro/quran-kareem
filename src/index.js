import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config/config.js';
import { deployCommands } from './handlers/commandHandler.js';
import { handleAutocomplete, handleCommand } from './handlers/interactionHandler.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await deployCommands();
});

client.on('interactionCreate', async interaction => {
  if (interaction.isAutocomplete()) {
    await handleAutocomplete(interaction);
    return;
  }

  if (interaction.isCommand()) {
    await handleCommand(interaction);
  }
});

client.login(config.discord.token).catch(error => {
  console.error('Failed to login:', error);
  process.exit(1);
});

/// loqmanas (l.q1)