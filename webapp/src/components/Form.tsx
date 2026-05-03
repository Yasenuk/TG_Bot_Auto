import { useEffect, useState } from "react";

import styles from "./from.module.scss";

function Form() {
	const [trips, setTrips] = useState([
		{
			cityId: 0
		}
	]);

	const initialForm = {
		carId: 0,
		consumption: 0,
		fuelPrice: 0,
		totalKm: 0,
	};

	const [form, setForm] = useState(initialForm);

	const [cars, setCars] = useState([]);
	const [departments, setDepartments] = useState([]);

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
			const carsRes = await fetch("/api/cars");
			const carsData = await carsRes.json();

			setCars(carsData);

			const citiesRes = await fetch("/api/cities");
			const citiesData = await citiesRes.json();

			setDepartments(citiesData);
		};

		load();
	}, []);

	const addCity = () => {
		setTrips([...trips, { cityId: 0 }]);
	};

	const removeCity = (index: number) => {
		setTrips(trips.filter((_, i) => i !== index));
	};

	const clearForm = () => {
		setForm(initialForm);
		setTrips([{ cityId: 0 }]);
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

			cities: trips
				.filter(c => c.cityId)
				.map(c => ({
					cityId: c.cityId
				}))
		};

		const res = await fetch("/api/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const data = await res.json();

		if (data.success) {
			clearForm();
			tg.close();
		}
	};

	return (
		<form className={`${styles.form} ${isDark ? styles._dark : styles._light}`}>
			<select
				className={styles.form__input}
				value={form.carId}
				onChange={e => setForm({
					...form,
					carId: +e.target.value
				})}
			>
				<option value={0}>Авто</option>

				{cars.map((car: any) => (
					<option key={car.id} value={car.id}>
						{car.name}
					</option>
				))}
			</select>

			<input
				className={styles.form__input}
				placeholder="Витрата"
				type="number"
				value={form.consumption || ""}
				onChange={(e) => setForm({
					...form,
					consumption: +e.target.value
				})}
			/>

			<input
				className={styles.form__input}
				placeholder="Ціна пального"
				type="number"
				value={form.fuelPrice || ""}
				onChange={(e) => setForm({
					...form,
					fuelPrice: +e.target.value
				})}
			/>

			<input
				className={styles.form__input}
				placeholder="Км"
				type="number"
				value={form.totalKm || ""}
				onChange={(e) => setForm({
					...form,
					totalKm: +e.target.value
				})}
			/>

			{trips.map((t, i) => (
				<div
					key={i}
					style={{
						display: "flex",
						gap: "8px",
						alignItems: "center"
					}}
				>
					<select
						className={styles.form__input}
						value={t.cityId}
						onChange={e => {
							const copy = [...trips];
							copy[i].cityId = +e.target.value;
							setTrips(copy);
						}}
					>
						<option value={0}>Місто</option>

						{departments.map((dep: any) => (
							<option key={dep.id} value={dep.id}>
								{dep.name}
							</option>
						))}
					</select>

					{trips.length > 1 && (
						<button
							type="button"
							onClick={() => removeCity(i)}
							style={{
								width: "28px",
								height: "28px",
								minWidth: "28px",
								padding: 0,
								fontSize: "14px",
								borderRadius: "50%"
							}}
						>
							✕
						</button>
					)}
				</div>
			))}

			<button
				className={styles.form__button}
				type="button"
				onClick={addCity}
			>
				+ місто
			</button>

			<button
				className={styles.form__button}
				type="button"
				onClick={clearForm}
			>
				Очистити
			</button>

			<button
				className={styles.form__button}
				type="button"
				onClick={submit}
			>
				Відправити
			</button>
		</form>
	);
}

export default Form;