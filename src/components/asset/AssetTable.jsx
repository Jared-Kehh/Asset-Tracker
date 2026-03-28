import Badge from '../ui/Badge'
import styles from './AssetTable.module.css'

const COLUMNS = [
  { key: 'companyNumber', label: 'Company #' },
  { key: 'name',          label: 'Device Name' },
  { key: 'brand',         label: 'Brand' },
  { key: 'model',         label: 'Model' },
  { key: 'serial',        label: 'Serial' },
  { key: 'department',    label: 'Department' },
  { key: 'location',      label: 'Location' },
  { key: 'status',        label: 'Status' },
  { key: 'assignedTo',    label: 'Assigned To' },
]

export default function AssetTable({ assets, total, sortBy, onSort, onView, onEdit, onDelete }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={styles.th}
                  onClick={() => onSort(col.key)}
                >
                  {col.label}
                  {sortBy === col.key && <span className={styles.sortArrow}> ↑</span>}
                </th>
              ))}
              <th className={`${styles.th} ${styles.actionsCol}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 && (
              <tr>
                <td colSpan={10} className={styles.empty}>
                  <div className={styles.emptyIcon}>📭</div>
                  <div className={styles.emptyTitle}>No assets found</div>
                  <div className={styles.emptySub}>Try adjusting your filters or add a new asset</div>
                </td>
              </tr>
            )}
            {assets.map(a => (
              <tr
                key={a.id}
                className={`table-row ${styles.row}`}
                onClick={() => onView(a)}
              >
                <td className={`${styles.td} ${styles.mono} ${styles.companyNum}`}>{a.companyNumber}</td>
                <td className={`${styles.td} ${styles.bold}`}>{a.name}</td>
                <td className={styles.td}>{a.brand}</td>
                <td className={`${styles.td} ${styles.mono} ${styles.small}`}>{a.model}</td>
                <td className={`${styles.td} ${styles.mono} ${styles.small}`}>{a.serial}</td>
                <td className={styles.td}>
                  {a.department
                    ? <span className={styles.deptBadge}>{a.department}</span>
                    : '—'}
                </td>
                <td className={`${styles.td} ${styles.small}`}>{a.location || '—'}</td>
                <td className={styles.td}><Badge status={a.status} /></td>
                <td className={`${styles.td} ${styles.small}`}>{a.assignedTo || '—'}</td>
                <td
                  className={`${styles.td} ${styles.actionsCol}`}
                  onClick={e => e.stopPropagation()}
                >
                  <div className={styles.actionBtns}>
                    <button
                      className={styles.editBtn}
                      title="Edit"
                      onClick={() => onEdit(a)}
                    >✏️</button>
                    <button
                      className={styles.deleteBtn}
                      title="Delete"
                      onClick={() => onDelete(a.id)}
                    >🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        Showing {assets.length} of {total} assets
      </div>
    </div>
  )
}
