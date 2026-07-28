import { Client, GatewayIntentBits, MessageFlags } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "prime") {
    await interaction.reply("Ella!!! 🎉");
  }

if (interaction.commandName === "kick") {
  const target = interaction.options.getUser("target", true);
  const reason = interaction.options.getString("reason") ?? "No reason provided";

  const member = await interaction.guild?.members.fetch(target.id);

  if (!member) {
    await interaction.reply({ content: "Couldn't find that member in this server.", flags: MessageFlags.Ephemeral });
    return;
  }

  if (!member.kickable) {
    await interaction.reply({ content: "I can't kick this member (they may have a higher role than me).", flags: MessageFlags.Ephemeral });
    return;
  }

  await member.kick(reason);
  await interaction.reply(`Kicked **${target.tag}** — Reason: ${reason}`);
}

if (interaction.commandName === "ban") {
  const target = interaction.options.getUser("target", true);
  const reason = interaction.options.getString("reason") ?? "No reason provided";
  const deleteDays = interaction.options.getInteger("delete_days") ?? 0;

  const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

  if (member && !member.bannable) {
    await interaction.reply({ content: "I can't ban this member (they may have a higher role than me).", flags: MessageFlags.Ephemeral });
    return;
  }

  await interaction.guild?.members.ban(target.id, {
    reason,
    deleteMessageSeconds: deleteDays * 24 * 60 * 60,
  });

  await interaction.reply(` Banned **${target.tag}** — Reason: ${reason}`);
}

if (interaction.commandName === "unban") {
  const username = interaction.options.getString("username", true);

  try {
    const bans = await interaction.guild?.bans.fetch();
    const bannedUser = bans?.find(
      (ban) => ban.user.username.toLowerCase() === username.toLowerCase()
    );

    if (!bannedUser) {
      await interaction.reply({ content: "Couldn't find a banned user with that username.", flags: MessageFlags.Ephemeral });
      return;
    }

    await interaction.guild?.members.unban(bannedUser.user.id);
    await interaction.reply(`Yessirski!! Unbanned **${bannedUser.user.tag}**`);
  } catch (error) {
    await interaction.reply({ content: "Something went wrong trying to unban that user.", flags: MessageFlags.Ephemeral });
  }
}

if (interaction.commandName === "timeout") {
  const target = interaction.options.getUser("target", true);
  const minutes = interaction.options.getInteger("minutes", true);
  const reason = interaction.options.getString("reason") ?? "No reason provided";

  const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

  if (!member) {
    await interaction.reply({ content: "Couldn't find that member in this server.", flags: MessageFlags.Ephemeral });
    return;
  }

  if (!member.moderatable) {
    await interaction.reply({ content: "I can't timeout this member (they may have a higher role than me).", flags: MessageFlags.Ephemeral });
    return;
  }

  const durationMs = minutes * 60 * 1000;
  await member.timeout(durationMs, reason);

  await interaction.reply(` YOUR COOKED Timed out **${target.tag}** for ${minutes} minute(s) — Reason: ${reason}`);
}
});


client.login(process.env.DISCORD_TOKEN);