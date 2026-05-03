import axios from "axios";

export async function sendTelegramMessage(
	chatId: number,
	text: string
) {
	await axios.post(
		`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
		{
			chat_id: chatId,
			text
		}
	);
}