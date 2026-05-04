import { bot } from "./shared/telegram";

import { startHandler } from "./handlers/start";
import { excelCallbackHandler, excelMenuHandler } from "./handlers/excel";

bot.start((ctx) => startHandler(ctx));

bot.command("excel", excelMenuHandler);

bot.action("excel_my",  excelCallbackHandler);
bot.action("excel_all", excelCallbackHandler);


bot.launch();