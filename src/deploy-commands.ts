import { REST, Routes, SlashCommandBuilder } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("prime")
    .setDescription("Replies with Ella!!! (tests the bot is alive)"),
  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why this member is being kicked")
        .setRequired(false)
    ),
].map((command) => command.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

async function deploy() {
  const clientId = process.env.CLIENT_ID!;
  const guildId = process.env.GUILD_ID!;

  const data = await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );

  console.log(`Successfully registered commands.`);
}

deploy();