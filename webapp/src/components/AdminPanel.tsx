import { useEffect, useState } from "react";
import styles from "./admin.module.scss";

const API_URL = import.meta.env.VITE_API_URL;

type Tab = "trips" | "cities" | "cars" | "admins";

interface Car { id: number; name: string; amortizationPerKm: number; consumptionMarkupPercent: number; }
interface City { id: number; name: string; }
interface Admin { id: number; userId: string; username?: string; }
interface Trip {
	id: number;
	userId: string;
	username?: string;
	car: Car;
	totalKm: number;
	consumption: number;
	consumptionMarkupPercent: number;
	fuelCost: number;
	amortizationCost: number;
	createdAt: string;
}

function getHeaders(userId: string) {
	return { "Content-Type": "application/json", "x-user-id": userId };
}

// Фінальна сума поїздки: пальне (вже з націнкою на розхід) + амортизація
function getTripTotalCost(t: Trip) {
	return t.fuelCost + t.amortizationCost;
}

// ── Trips Tab ───────────────────────────────────────────

const MONTH_NAMES = [
	"Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
	"Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

function toMonthKey(year: number, monthIndex: number) {
	return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function formatMonth(monthKey: string) {
	const [year, month] = monthKey.split("-").map(Number);
	return `${MONTH_NAMES[month - 1]} ${year}`;
}

function MonthPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
	const [year, month] = value.split("-").map(Number);
	const now = new Date();
	const currentYear = now.getFullYear();
	const isCurrentMonth = year === currentYear && month - 1 === now.getMonth();

	const fromYear = Math.min(year, currentYear - 4);
	const years = Array.from({ length: currentYear - fromYear + 1 }, (_, i) => currentYear - i);

	const shift = (delta: number) => {
		const date = new Date(year, month - 1 + delta, 1);
		onChange(toMonthKey(date.getFullYear(), date.getMonth()));
	};

	return (
		<div className={styles.monthPicker}>
			<button type="button" className={`${styles.btn} ${styles.btn_secondary}`}
				onClick={() => shift(-1)} aria-label="Попередній місяць">‹</button>
			<select className={styles.input} value={month - 1}
				onChange={e => onChange(toMonthKey(year, Number(e.target.value)))}>
				{MONTH_NAMES.map((name, i) => (
					<option key={name} value={i} disabled={year === currentYear && i > now.getMonth()}>{name}</option>
				))}
			</select>
			<select className={`${styles.input} ${styles.monthPicker__year}`} value={year}
				onChange={e => {
					const nextYear = Number(e.target.value);
					const nextMonth = nextYear === currentYear ? Math.min(month - 1, now.getMonth()) : month - 1;
					onChange(toMonthKey(nextYear, nextMonth));
				}}>
				{years.map(y => <option key={y} value={y}>{y}</option>)}
			</select>
			<button type="button" className={`${styles.btn} ${styles.btn_secondary}`}
				onClick={() => shift(1)} disabled={isCurrentMonth} aria-label="Наступний місяць">›</button>
		</div>
	);
}

function TripsTab({ userId }: { userId: string }) {
	const now = new Date();
	const [month, setMonth] = useState(toMonthKey(now.getFullYear(), now.getMonth()));
	const [trips, setTrips] = useState<Trip[]>([]);
	const [selected, setSelected] = useState<Set<number>>(new Set());
	const [loading, setLoading] = useState(false);

	const load = async () => {
		setLoading(true);
		const res = await fetch(`${API_URL}/api/admin/trips?month=${month}`, {
			headers: getHeaders(userId)
		});
		const data = await res.json();
		setTrips(data);
		setSelected(new Set());
		setLoading(false);
	};

	useEffect(() => { load(); }, [month]);

	const toggleSelect = (id: number) => {
		const next = new Set(selected);
		next.has(id) ? next.delete(id) : next.add(id);
		setSelected(next);
	};

	const toggleAll = () => {
		if (selected.size === trips.length) setSelected(new Set());
		else setSelected(new Set(trips.map(t => t.id)));
	};

	const deleteSelected = async () => {
		if (!selected.size) return;
		if (!confirm(`Видалити ${selected.size} записів?`)) return;
		await fetch(`${API_URL}/api/admin/trips`, {
			method: "DELETE",
			headers: getHeaders(userId),
			body: JSON.stringify({ ids: [...selected] })
		});
		load();
	};

	const deleteMonth = async () => {
		if (!confirm(`Видалити всі поїздки за ${formatMonth(month)}?`)) return;
		await fetch(`${API_URL}/api/admin/trips/month`, {
			method: "DELETE",
			headers: getHeaders(userId),
			body: JSON.stringify({ month })
		});
		load();
	};

	return (
		<div className={styles.tab}>
			<div className={styles.toolbar}>
				<MonthPicker value={month} onChange={setMonth} />
				<button className={styles.btn} onClick={load}>Оновити</button>
			</div>

			{trips.length > 0 && (
				<div className={styles.toolbar}>
					<button className={`${styles.btn} ${styles.btn_secondary}`} onClick={toggleAll}>
						{selected.size === trips.length ? "Зняти всі" : "Вибрати всі"}
					</button>
					{selected.size > 0 && (
						<button className={`${styles.btn} ${styles.btn_danger}`} onClick={deleteSelected}>
							Видалити вибрані ({selected.size})
						</button>
					)}
					<button className={`${styles.btn} ${styles.btn_danger}`} onClick={deleteMonth}>
						Видалити місяць
					</button>
				</div>
			)}

			{loading && <p className={styles.hint}>Завантаження...</p>}

			{!loading && trips.length === 0 && (
				<p className={styles.hint}>Немає поїздок за {formatMonth(month)}</p>
			)}

			{trips.map(t => (
				<div
					key={t.id}
					className={`${styles.card} ${selected.has(t.id) ? styles.card_selected : ""}`}
					onClick={() => toggleSelect(t.id)}
				>
					<div className={styles.card__row}>
						<input
							type="checkbox"
							checked={selected.has(t.id)}
							onChange={() => toggleSelect(t.id)}
							onClick={e => e.stopPropagation()}
						/>
						<span className={styles.card__title}>
							{t.username ? `@${t.username}` : t.userId}
						</span>
						<span className={styles.card__hint}>
							{new Date(t.createdAt).toLocaleDateString("uk-UA")}
						</span>
					</div>
					<div className={styles.card__meta}>
						{t.car.name} · {t.totalKm} км · 📊 {t.consumption} л/100км (+{t.consumptionMarkupPercent}%) · ⛽ {t.fuelCost.toFixed(2)} грн · 🔧 {t.amortizationCost.toFixed(2)} грн · 💰 {getTripTotalCost(t).toFixed(2)} грн
					</div>
				</div>
			))}
		</div>
	);
}

// ── Cities Tab ──────────────────────────────────────────

function CitiesTab({ userId }: { userId: string }) {
	const [cities, setCities] = useState<City[]>([]);
	const [editId, setEditId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");
	const [newName, setNewName] = useState("");

	const load = async () => {
		const res = await fetch(`${API_URL}/api/admin/cities`, { headers: getHeaders(userId) });
		setCities(await res.json());
	};

	useEffect(() => { load(); }, []);

	const add = async () => {
		if (!newName.trim()) return;
		await fetch(`${API_URL}/api/admin/cities`, {
			method: "POST",
			headers: getHeaders(userId),
			body: JSON.stringify({ name: newName.trim() })
		});
		setNewName("");
		load();
	};

	const save = async (id: number) => {
		await fetch(`${API_URL}/api/admin/cities/${id}`, {
			method: "PUT",
			headers: getHeaders(userId),
			body: JSON.stringify({ name: editName })
		});
		setEditId(null);
		load();
	};

	const remove = async (id: number, name: string) => {
		if (!confirm(`Видалити місто "${name}"?`)) return;
		await fetch(`${API_URL}/api/admin/cities/${id}`, {
			method: "DELETE",
			headers: getHeaders(userId)
		});
		load();
	};

	return (
		<div className={styles.tab}>
			<div className={styles.toolbar}>
				<input
					className={styles.input}
					placeholder="Нове місто"
					value={newName}
					onChange={e => setNewName(e.target.value)}
					onKeyDown={e => e.key === "Enter" && add()}
				/>
				<button className={styles.btn} onClick={add}>Додати</button>
			</div>

			{cities.map(c => (
				<div key={c.id} className={styles.card}>
					{editId === c.id ? (
						<div className={styles.card__row}>
							<input
								className={styles.input}
								value={editName}
								onChange={e => setEditName(e.target.value)}
								onKeyDown={e => e.key === "Enter" && save(c.id)}
								autoFocus
							/>
							<button className={styles.btn} onClick={() => save(c.id)}>Зберегти</button>
							<button className={`${styles.btn} ${styles.btn_secondary}`} onClick={() => setEditId(null)}>Скасувати</button>
						</div>
					) : (
						<div className={styles.card__row}>
							<span className={styles.card__title}>{c.name}</span>
							<button className={`${styles.btn} ${styles.btn_secondary}`} onClick={() => { setEditId(c.id); setEditName(c.name); }}>✏️</button>
							<button className={`${styles.btn} ${styles.btn_danger}`} onClick={() => remove(c.id, c.name)}>🗑</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

// ── Cars Tab ─────────────────────────────────────────────

const emptyCarForm = { name: "", amortizationPerKm: "", consumptionMarkupPercent: "" };

function CarsTab({ userId }: { userId: string }) {
	const [cars, setCars] = useState<Car[]>([]);
	const [editId, setEditId] = useState<number | null>(null);
	const [editData, setEditData] = useState(emptyCarForm);
	const [newData, setNewData] = useState(emptyCarForm);

	const load = async () => {
		const res = await fetch(`${API_URL}/api/admin/cars`, { headers: getHeaders(userId) });
		setCars(await res.json());
	};

	useEffect(() => { load(); }, []);

	const add = async () => {
		if (!newData.name.trim() || !newData.amortizationPerKm) return;
		await fetch(`${API_URL}/api/admin/cars`, {
			method: "POST",
			headers: getHeaders(userId),
			body: JSON.stringify({
				name: newData.name.trim(),
				amortizationPerKm: Number(newData.amortizationPerKm),
				consumptionMarkupPercent: Number(newData.consumptionMarkupPercent) || 0
			})
		});
		setNewData(emptyCarForm);
		load();
	};

	const save = async (id: number) => {
		await fetch(`${API_URL}/api/admin/cars/${id}`, {
			method: "PUT",
			headers: getHeaders(userId),
			body: JSON.stringify({
				name: editData.name,
				amortizationPerKm: Number(editData.amortizationPerKm),
				consumptionMarkupPercent: Number(editData.consumptionMarkupPercent) || 0
			})
		});
		setEditId(null);
		load();
	};

	const remove = async (id: number, name: string) => {
		if (!confirm(`Видалити авто "${name}"?`)) return;
		await fetch(`${API_URL}/api/admin/cars/${id}`, {
			method: "DELETE",
			headers: getHeaders(userId)
		});
		load();
	};

	return (
		<div className={styles.tab}>
			<div className={`${styles.toolbar} ${styles.toolbar_column}`}>
				<input className={styles.input} placeholder="Назва авто" value={newData.name}
					onChange={e => setNewData({ ...newData, name: e.target.value })} />
				<input className={styles.input} placeholder="Амортизація/км" type="number" value={newData.amortizationPerKm}
					onChange={e => setNewData({ ...newData, amortizationPerKm: e.target.value })} />
				<input className={styles.input} placeholder="Націнка на розхід, %" type="number" min={0} step="any" value={newData.consumptionMarkupPercent}
					onChange={e => setNewData({ ...newData, consumptionMarkupPercent: e.target.value })} />
				<button className={styles.btn} onClick={add}>Додати</button>
			</div>

			{cars.map(c => (
				<div key={c.id} className={styles.card}>
					{editId === c.id ? (
						<div className={styles.card__col}>
							<input className={styles.input} value={editData.name}
								onChange={e => setEditData({ ...editData, name: e.target.value })} autoFocus />
							<input className={styles.input} type="number" value={editData.amortizationPerKm}
								onChange={e => setEditData({ ...editData, amortizationPerKm: e.target.value })} />
							<input className={styles.input} placeholder="Націнка на розхід, %" type="number" min={0} step="any" value={editData.consumptionMarkupPercent}
								onChange={e => setEditData({ ...editData, consumptionMarkupPercent: e.target.value })} />
							<div className={styles.card__row}>
								<button className={styles.btn} onClick={() => save(c.id)}>Зберегти</button>
								<button className={`${styles.btn} ${styles.btn_secondary}`} onClick={() => setEditId(null)}>Скасувати</button>
							</div>
						</div>
					) : (
						<div className={styles.card__row}>
							<span className={styles.card__title}>{c.name}</span>
							<span className={styles.card__hint}>{c.amortizationPerKm} грн/км · розхід +{c.consumptionMarkupPercent}%</span>
							<button className={`${styles.btn} ${styles.btn_secondary}`}
								onClick={() => { setEditId(c.id); setEditData({ name: c.name, amortizationPerKm: String(c.amortizationPerKm), consumptionMarkupPercent: String(c.consumptionMarkupPercent) }); }}>✏️</button>
							<button className={`${styles.btn} ${styles.btn_danger}`} onClick={() => remove(c.id, c.name)}>🗑</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

// ── Admins Tab ────────────────────────────────────────────

function AdminsTab({ userId }: { userId: string }) {
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [newUserId, setNewUserId] = useState("");
	const [newUsername, setNewUsername] = useState("");

	const load = async () => {
		const res = await fetch(`${API_URL}/api/admin/admins`, { headers: getHeaders(userId) });
		setAdmins(await res.json());
	};

	useEffect(() => { load(); }, []);

	const add = async () => {
		if (!newUserId.trim()) return;
		await fetch(`${API_URL}/api/admin/admins`, {
			method: "POST",
			headers: getHeaders(userId),
			body: JSON.stringify({ userId: newUserId.trim(), username: newUsername.trim() || undefined })
		});
		setNewUserId("");
		setNewUsername("");
		load();
	};

	const remove = async (adminUserId: string, username?: string) => {
		if (!confirm(`Видалити адміна ${username ? `@${username}` : adminUserId}?`)) return;
		await fetch(`${API_URL}/api/admin/admins/${adminUserId}`, {
			method: "DELETE",
			headers: getHeaders(userId)
		});
		load();
	};

	return (
		<div className={styles.tab}>
			<div className={styles.toolbar}>
				<input className={styles.input} placeholder="Telegram User ID" value={newUserId}
					onChange={e => setNewUserId(e.target.value)} />
				<input className={styles.input} placeholder="Username (опційно)" value={newUsername}
					onChange={e => setNewUsername(e.target.value)} />
				<button className={styles.btn} onClick={add}>Додати</button>
			</div>

			{admins.map(a => (
				<div key={a.id} className={styles.card}>
					<div className={styles.card__row}>
						<span className={styles.card__title}>{a.username ? `@${a.username}` : a.userId}</span>
						<span className={styles.card__hint}>{a.userId}</span>
						<button className={`${styles.btn} ${styles.btn_danger}`}
							onClick={() => remove(a.userId, a.username)}>🗑</button>
					</div>
				</div>
			))}
		</div>
	);
}

// ── Root ──────────────────────────────────────────────────

export default function AdminPanel({ userId, onBack }: { userId: string; onBack: () => void }) {
	const [tab, setTab] = useState<Tab>("trips");

	const tabs: { key: Tab; label: string }[] = [
		{ key: "trips", label: "Поїздки" },
		{ key: "cities", label: "Міста" },
		{ key: "cars", label: "Авто" },
		{ key: "admins", label: "Адміни" },
	];

	return (
		<div className={styles.panel}>
			<div className={styles.header}>
				<button className={styles.backBtn} onClick={onBack}>← Назад</button>
				<span className={styles.headerTitle}>Адмін панель</span>
			</div>
			<div className={styles.tabs}>
				{tabs.map(t => (
					<button
						key={t.key}
						className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtn_active : ""}`}
						onClick={() => setTab(t.key)}
					>
						{t.label}
					</button>
				))}
			</div>

			{tab === "trips" && <TripsTab userId={userId} />}
			{tab === "cities" && <CitiesTab userId={userId} />}
			{tab === "cars" && <CarsTab userId={userId} />}
			{tab === "admins" && <AdminsTab userId={userId} />}
		</div>
	);
}
