import { Markup } from "telegraf";

export function startHandler(ctx: any) {
  return ctx.reply(
    `🚗 Облік витрат пального

Заповни дані по поїздках:
• автомобіль
• витрата пального
• вартість пального
• міста та кілометраж`,
    Markup.keyboard([
      ["📊 Завантажити Excel"]
    ]).resize()
  );
}