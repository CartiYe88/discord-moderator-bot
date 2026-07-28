import { REST, Routes, SlashCommandBuilder } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("prime")
    .setDescription("Replies with Ella!!! (tests the bot is alive)"),
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