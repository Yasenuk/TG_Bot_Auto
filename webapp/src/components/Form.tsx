import { useEffect, useState } from 'react'

import styles from "./from.module.scss";

function From() {
	const [trips, setTrips] = useState([{ city: "", km: 0 }]);
	const [cars, setCars] = useState<any[]>([]);
	const [departments, setDepartments] = useState<any[]>([]);

	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const tg = (window as any).Telegram?.WebApp;

		if (!tg) return;

		tg.ready();
		tg.expand();

		setIsDark(tg.colorScheme === "dark");
	}, []);

	useEffect(() => {
		const load = async () => {
			const [carsRes, depRes] = await Promise.all([
				fetch("/api/cars"),
				fetch("/api/departments")
			]);

			setCars(await carsRes.json());
			setDepartments(await depRes.json());
		};

		load();
	}, []);

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
						onChange={e => {
							const copy = [...trips];
							copy[i].city = e.target.value;
							setTrips(copy);
						}}
					/>

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
