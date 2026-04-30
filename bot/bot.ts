import { bot } from "../shared/telegram";
import { startHandler } from "./handlers/start";

bot.start((ctx) => startHandler(ctx));

bot.launch();