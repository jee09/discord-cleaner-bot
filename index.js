require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
} = require('discord.js');

const BAD_CHARS = ['ㅗ'];
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.once('ready', () => {
  console.log(`로그인 완료: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const content = message.content ?? '';
  if (!BAD_CHARS.some((c) => content.includes(c))) return;

  const HEART = '💖';

  const cleaned = BAD_CHARS.reduce(
    (acc, c) => acc.split(c).join(HEART),
    content
  ).trim();

  const me = message.guild.members.me;
  const perms = message.channel.permissionsFor(me);
  if (!perms?.has(PermissionsBitField.Flags.ManageMessages)) return;

  await message.delete().catch(() => null);
  const authorName = message.member?.displayName ?? message.author.username;
  await message.channel.send(`${authorName} : ${cleaned}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
