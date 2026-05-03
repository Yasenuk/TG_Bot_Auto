import { bot } from "./shared/telegram";

import { startHandler } from "./handlers/start";
import { excelHandler } from "./handlers/excel";

bot.start((ctx) => startHandler(ctx));

bot.hears("📊 Завантажити Excel", async (ctx) => await excelHandler(ctx));


bot.launch();