import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

export { bot };