import { Markup } from "telegraf";

export function startHandler(ctx: any) {
  return ctx.reply(
    `🚗 Облік витрат пального

Заповни дані по поїздках:
• автомобіль
• витрата пального
• вартість пального
• міста та кілометраж

Після відправки бот порахує витрати по кожному місту.`,
    Markup.inlineKeyboard([
      [
        Markup.button.webApp(
          "📋 Відкрити форму",
          "https://carry-unburned-payback.ngrok-free.dev"
        )
      ]
    ])
  );
}