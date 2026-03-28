import { DEPARTMENTS, LOCATIONS, STATUS_OPTIONS, STATUS_COLORS } from '../../constants'
import styles from './Dashboard.module.css'

export default function Dashboard({ assets }) {
  const total = assets.length || 1

  const deptCounts = DEPARTMENTS
    .map(d => ({ d, count: assets.filter(a => a.department === d).length }))
    .filter(x => x.count > 0)

  const locCounts = LOCATIONS
    .map(l => ({ l, count: assets.filter(a => a.location === l).length }))
    .filter(x => x.count > 0)

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Assets by Department</h3>
        {deptCounts.map(({ d, count }) => (
          <BarRow key={d} label={d} count={count} total={total} color="linear-gradient(90deg,#2563eb,#4f46e5)" />
        ))}
        {deptCounts.length === 0 && <p className={styles.empty}>No data yet.</p>}
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Assets by Location</h3>
        {locCounts.map(({ l, count }) => (
          <BarRow key={l} label={l} count={count} total={total} color="linear-gradient(90deg,#10b981,#059669)" />
        ))}
        {locCounts.length === 0 && <p className={styles.empty}>No data yet.</p>}
      </div>

      <div className={`${styles.card} ${styles.fullWidth}`}>
        <h3 className={styles.cardTitle}>Status Breakdown</h3>
        <div className={styles.statusGrid}>
          {STATUS_OPTIONS.map(s => {
            const count = assets.filter(a => a.status === s).length
            const c = STATUS_COLORS[s]
            return (
              <div key={s} className={styles.statusCard} style={{ background: c.bg }}>
                <div className={styles.statusCount} style={{ color: c.text }}>{count}</div>
                <div className={styles.statusLabel} style={{ color: c.text }}>{s}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BarRow({ label, count, total, color }) {
  return (
    <div className={styles.barRow}>
      <div className={styles.barMeta}>
        <span className={styles.barLabel}>{label}</span>
        <span className={styles.barCount}>{count}</span>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${(count / total) * 100}%`, background: color }}
        />
      </div>
    </div>
  )
}
