import { STATUS_COLORS } from '../../constants'
import styles from './Badge.module.css'

export default function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS['Active']
  return (
    <span
      className={styles.badge}
      style={{ background: c.bg, color: c.text }}
    >
      <span className={styles.dot} style={{ background: c.dot }} />
      {status}
    </span>
  )
}
