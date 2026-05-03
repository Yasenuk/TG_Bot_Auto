import axios from "axios";

export async function excelHandler(ctx: any) {
	try {
		const response = await axios.get(
			`${process.env.SERVER_URL}/api/excel`,
			{
				responseType: "arraybuffer"
			}
		);

		await ctx.replyWithDocument({
			source: Buffer.from(response.data),
			filename: "trips.xlsx"
		});
	} catch (e) {
		console.log(e);

		await ctx.reply("Помилка при генерації Excel");
	}
}