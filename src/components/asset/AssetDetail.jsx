import Badge from '../ui/Badge'
import styles from './AssetDetail.module.css'

export default function AssetDetail({ asset, onEdit, onDelete }) {
  const fields = [
    ['Company Number', asset.companyNumber, true],
    ['Device Name',    asset.name],
    ['Brand',          asset.brand],
    ['Device Type',    asset.type],
    ['Model Number',   asset.model, true],
    ['Serial Number',  asset.serial, true],
    ['Department',     asset.department],
    ['Location',       asset.location],
    ['Status',         null, false, <Badge key="status" status={asset.status} />],
    ['Assigned To',    asset.assignedTo || '—'],
    ['Purchase Date',  asset.purchaseDate || '—'],
  ]

  return (
    <div>
      <div className={styles.grid}>
        {fields.map(([label, val, mono, comp]) => (
          <div key={label} className={styles.field}>
            <div className={styles.fieldLabel}>{label}</div>
            {comp || (
              <div className={`${styles.fieldValue} ${mono ? styles.mono : ''}`}>
                {val || '—'}
              </div>
            )}
          </div>
        ))}
        {asset.notes && (
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <div className={styles.fieldLabel}>Notes</div>
            <div className={styles.fieldValue}>{asset.notes}</div>
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <button className={styles.deleteBtn} onClick={() => onDelete(asset.id)}>
          Delete
        </button>
        <button className={styles.editBtn} onClick={() => onEdit(asset)}>
          Edit Asset
        </button>
      </div>
    </div>
  )
}
