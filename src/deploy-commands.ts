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
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server")
    .addUserOption((option) =>
        option
        .setName("target")
        .setDescription("The member to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
        option
        .setName("reason")
        .setDescription("Why is buddy being banned")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
        option
        .setName("delete_days")
        .setDescription("Days of message history to delete (0-7)")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(7)
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