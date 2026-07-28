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

});


client.login(process.env.DISCORD_TOKEN);