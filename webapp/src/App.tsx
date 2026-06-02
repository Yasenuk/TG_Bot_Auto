import { useEffect, useState } from "react";
import styles from "./app.module.scss";
import Form from "./components/Form";
import AdminPanel from "./components/AdminPanel";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
	const [userId, setUserId] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [checked, setChecked] = useState(false);
	const [showAdmin, setShowAdmin] = useState(false);

	useEffect(() => {
		const tg = (window as any).Telegram?.WebApp;
		if (!tg) { setChecked(true); return; }

		tg.ready();
		tg.expand();

		const uid = tg.initDataUnsafe?.user?.id;
		if (!uid) { setChecked(true); return; }

		const uidStr = String(uid);
		setUserId(uidStr);

		fetch(`${API_URL}/api/admin/check`, {
			headers: { "x-user-id": uidStr }
		})
			.then(r => r.json())
			.then(d => setIsAdmin(d.isAdmin))
			.finally(() => setChecked(true));
	}, []);

	if (!checked) return null;

	return (
		<div className={styles.container}>
			{showAdmin && userId
				? <AdminPanel userId={userId} onBack={() => setShowAdmin(false)} />
				: <Form isAdmin={isAdmin} onAdminClick={() => setShowAdmin(true)} />
			}
		</div>
	);
}
