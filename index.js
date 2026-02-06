require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
} = require('discord.js');

const BAD_CHARS = ['ㅗ', '낙'];
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

  const CATS = ['🐈', '🐈‍⬛'];
  let catIndex = 0;

  let cleaned = content;
  // '낙'을 '낛'으로 먼저 치환
  cleaned = cleaned.split('낙').join('낛');
  // 나머지 BAD_CHARS는 고양이 이모지로 번갈아가며 치환
  for (const badChar of BAD_CHARS.filter((c) => c !== '낙')) {
    const parts = cleaned.split(badChar);
    cleaned = parts.reduce((result, part, index) => {
      if (index < parts.length - 1) {
        const cat = CATS[catIndex % CATS.length];
        catIndex++;
        return result + part + cat;
      }
      return result + part;
    }, '');
  }
  cleaned = cleaned.trim();

  const me = message.guild.members.me;
  const perms = message.channel.permissionsFor(me);
  if (!perms?.has(PermissionsBitField.Flags.ManageMessages)) return;

  await message.delete().catch(() => null);
  const authorName = message.member?.displayName ?? message.author.username;
  await message.channel.send(`${authorName} : ${cleaned}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
