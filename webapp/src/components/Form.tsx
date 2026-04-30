import { useEffect, useState } from 'react'

import styles from "./from.module.scss";

function From() {
	const [trips, setTrips] = useState([{ city: "", km: 0 }]);
	const [isDark, setIsDark] = useState(false);
	const [suggestions, setSuggestions] = useState<Record<number, string[]>>({});

	useEffect(() => {
		const tg = (window as any).Telegram?.WebApp;

		if (!tg) return;

		tg.ready();
		tg.expand();

		setIsDark(tg.colorScheme === "dark");
	}, []);

	const searchCity = async (value: string) => {
		if (value.length < 2) return [];

		const res = await fetch(
			`http://api.geonames.org/searchJSON?country=UA&name_startsWith=${value}&maxRows=5&username=demo`
		);

		const data = await res.json();

		return data.geonames.map((item: any) => item.name);
	};

	const handleCityChange = async (value: string, index: number) => {
		const copy = [...trips];
		copy[index].city = value;
		setTrips(copy);

		if (value.length < 2) {
			setSuggestions(prev => ({
				...prev,
				[index]: []
			}));
			return;
		}

		const result = await searchCity(value);

		setSuggestions(prev => ({
			...prev,
			[index]: result
		}));
	};

	const [form, setForm] = useState({
		carName: "",
		consumption: 0,
		fuelPrice: 0
	});

	const addTrip = () => {
		setTrips([...trips, { city: "", km: 0 }]);
	};

	const submit = async () => {
		const tg = (window as any).Telegram?.WebApp;

		if (!tg) {
			alert("Open inside Telegram");
			return;
		}

		const payload = {
			userId: tg.initDataUnsafe.user.id,
			username: tg.initDataUnsafe.user.username,
			...form,
			trips
		};

		const res = await fetch("/api/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		const data = await res.json();

		if (data.success) {
			tg.close();
		}
	};

	return (
		<form className={`${styles.form} ${isDark ? styles._dark : styles._light}`}>
			<input
				className={styles.form__input}
				placeholder="Авто"
				onChange={e => setForm({ ...form, carName: e.target.value })}
			/>

			<input
				className={styles.form__input}
				placeholder="Витрата"
				type="number"
				onChange={e => setForm({ ...form, consumption: +e.target.value })}
			/>

			<input
				className={styles.form__input}
				placeholder="Ціна"
				type="number"
				onChange={e => setForm({ ...form, fuelPrice: +e.target.value })}
			/>

			{trips.map((t, i) => (
				<div key={i} className={styles.form__trip}>
					<input
						className={styles.form__input}
						placeholder="Місто"
						value={t.city}
						onChange={e => handleCityChange(e.target.value, i)}
					/>

					{suggestions[i]?.length > 0 && (
						<div className={styles.suggestions}>
							{suggestions[i].map((city, idx) => (
								<div
									key={idx}
									onClick={() => {
										const copy = [...trips];
										copy[i].city = city;
										setTrips(copy);

										setSuggestions(prev => ({
											...prev,
											[i]: []
										}));
									}}
									className={styles.suggestion}
								>
									{city}
								</div>
							))}
						</div>
					)}

					<input
						className={styles.form__input}
						type="number"
						placeholder="КМ"
						onChange={e => {
							const copy = [...trips];
							copy[i].km = +e.target.value;
							setTrips(copy);
						}}
					/>
				</div>
			))}

			<div className={styles.form__buttons}>
				<button
					type="button"
					className={`${styles.form__button} ${styles.form__button_secondary}`}
					onClick={addTrip}
				>
					+ місто
				</button>

				<button
					type="button"
					className={styles.form__button}
					onClick={submit}
				>
					Відправити
				</button>
			</div>
		</form>
	);
}

export default From
