import { useState } from 'react'

import styles from "./form.module.scss";

function From() {
	const [trips, setTrips] = useState([{ city: "", km: 0 }]);

	const [form, setForm] = useState({
		carName: "",
		consumption: 0,
		fuelPrice: 0
	});

	const addTrip = () => {
		setTrips([...trips, { city: "", km: 0 }]);
	};

	const submit = async () => {
		const tg = (window as any).Telegram.WebApp;

		await fetch("https://carry-unburned-payback.ngrok-free.dev/api/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userId: tg.initDataUnsafe.user.id,
				...form,
				trips
			})
		});

		tg.close();
	};

	return (
		<form className={styles.form} method='post'>
			<input className={styles.form__input} placeholder="Авто" onChange={e => setForm({ ...form, carName: e.target.value })} />
			<input className={styles.form__input} placeholder="Витрата" type="number" onChange={e => setForm({ ...form, consumption: +e.target.value })} />
			<input className={styles.form__input} placeholder="Ціна" type="number" onChange={e => setForm({ ...form, fuelPrice: +e.target.value })} />

			{trips.map((t, i) => (
				<div key={i}>
					<input className={styles.form__input} placeholder="Місто" onChange={e => {
						const copy = [...trips];
						copy[i].city = e.target.value;
						setTrips(copy);
					}} />
					<input className={styles.form__input} type="number" placeholder="КМ" onChange={e => {
						const copy = [...trips];
						copy[i].km = +e.target.value;
						setTrips(copy);
					}} />
				</div>
			))}

			<button className={styles.form__button} onClick={addTrip}>+ місто</button>
			<button className={styles.form__button} onClick={submit}>Відправити</button>
		</form>
	);
}

export default From
