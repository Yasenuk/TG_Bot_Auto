import { useEffect, useState } from "react";

import styles from "./from.module.scss";

function Form() {
	const [cities, setCities] = useState<any[]>([]);

	const [tripCities, setTripCities] = useState<
		{ cityId: number | null }[]
	>([{ cityId: null }]);

	const [form, setForm] = useState({
		carName: "",
		amortizationPerKm: 0,
		consumption: 0,
		fuelPrice: 0,
		totalKm: 0,
	});

	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const tg = (window as any).Telegram?.WebApp;
		if (!tg) return;

		tg.ready();
		tg.expand();

		setIsDark(tg.colorScheme === "dark");
	}, []);

	useEffect(() => {
		fetch("/api/cities")
			.then((r) => r.json())
			.then(setCities);
	}, []);

	const addCity = () => {
		setTripCities([...tripCities, { cityId: null }]);
	};

	const submit = async () => {
		const tg = (window as any).Telegram?.WebApp;

		if (!tg) {
			alert("Open in Telegram");
			return;
		}

		const payload = {
			userId: tg.initDataUnsafe.user.id,
			username: tg.initDataUnsafe.user.username,
			...form,
			cities: tripCities.filter((c) => c.cityId),
		};

		const res = await fetch("/api/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const data = await res.json();

		if (data.success) tg.close();
	};

	return (
		<form className={`${styles.form} ${isDark ? styles._dark : styles._light}`}>
			<input
				className={styles.form__input}
				placeholder="Авто"
				onChange={(e) => setForm({ ...form, carName: e.target.value })}
			/>

			<input
				className={styles.form__input}
				placeholder="Амортизація"
				type="number"
				onChange={(e) =>
					setForm({ ...form, amortizationPerKm: +e.target.value })
				}
			/>

			<input
				className={styles.form__input}
				placeholder="Витрата"
				type="number"
				onChange={(e) => setForm({ ...form, consumption: +e.target.value })}
			/>

			<input
				className={styles.form__input}
				placeholder="Ціна пального"
				type="number"
				onChange={(e) => setForm({ ...form, fuelPrice: +e.target.value })}
			/>

			<input
				className={styles.form__input}
				placeholder="Км"
				type="number"
				onChange={(e) => setForm({ ...form, totalKm: +e.target.value })}
			/>

			{tripCities.map((t, i) => (
				<select
					className={styles.form__input}
					key={i}
					value={t.cityId ?? ""}
					onChange={(e) => {
						const copy = [...tripCities];
						copy[i].cityId = +e.target.value;
						setTripCities(copy);
					}}
				>
					<option value="">Місто</option>
					{cities.map((c: any) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
			))}

			<button className={styles.form__button} type="button" onClick={addCity}>
				+ місто
			</button>

			<button className={styles.form__button} type="button" onClick={submit}>
				Відправити
			</button>
		</form>
	);
}

export default Form;