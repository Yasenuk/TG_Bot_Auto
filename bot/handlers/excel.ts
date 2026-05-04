import axios from "axios";

const ADMIN_IDS: number[] = [
  123456789,
];

export async function excelMenuHandler(ctx: any) {
  const telegramId: number = ctx.from?.id;
  const buttons: any[] = [
    [{ text: "📊 Мій звіт", callback_data: "excel_my" }],
  ];

  if (ADMIN_IDS.includes(telegramId)) {
    buttons.push([
      { text: "📋 Всі дані (адмін)", callback_data: "excel_all" },
    ]);
  }

  await ctx.reply("Оберіть тип звіту:", {
    reply_markup: { inline_keyboard: buttons },
  });
}

export async function excelCallbackHandler(ctx: any) {
  const telegramId: number = ctx.from?.id;
  const action: string = ctx.callbackQuery?.data;

  await ctx.answerCbQuery();
  await ctx.reply("⏳ Генерую файл...");

  if (action === "excel_my") {
    await sendExcel(ctx, telegramId);
  } else if (action === "excel_all" && ADMIN_IDS.includes(telegramId)) {
    await sendExcel(ctx, undefined);
  }
}

async function sendExcel(ctx: any, telegramId?: number) {
  try {
    const url = telegramId !== undefined
      ? `${process.env.SERVER_URL}/api/excel?userId=${telegramId}`
      : `${process.env.SERVER_URL}/api/excel`;

    const response = await axios.get(url, { responseType: "arraybuffer" });

    await ctx.replyWithDocument({
      source: Buffer.from(response.data),
      filename: "trips.xlsx",
    });
  } catch (e) {
    console.error(e);
    await ctx.reply("❌ Помилка при генерації Excel");
  }
}