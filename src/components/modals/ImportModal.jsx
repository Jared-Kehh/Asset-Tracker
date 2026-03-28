import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { generateId } from '../../constants'
import styles from './ImportModal.module.css'

const FIELDS = [
  { key: 'companyNumber', label: 'Company Number' },
  { key: 'name',          label: 'Device Name' },
  { key: 'brand',         label: 'Brand' },
  { key: 'model',         label: 'Model Number' },
  { key: 'serial',        label: 'Serial Number' },
  { key: 'type',          label: 'Device Type' },
  { key: 'department',    label: 'Department' },
  { key: 'location',      label: 'Location' },
  { key: 'status',        label: 'Status' },
  { key: 'assignedTo',    label: 'Assigned To' },
  { key: 'purchaseDate',  label: 'Purchase Date' },
  { key: 'notes',         label: 'Notes' },
]

export default function ImportModal({ onImport, onClose }) {
  const [step, setStep]       = useState(1)
  const [headers, setHeaders] = useState([])
  const [rows, setRows]       = useState([])
  const [mapping, setMapping] = useState({})
  const fileRef = useRef()

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const wb   = XLSX.read(ev.target.result, { type: 'binary' })
      const ws   = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
      if (data.length < 2) { alert('File appears empty.'); return }
      const hdrs = data[0].map(String)
      const dataRows = data.slice(1).filter(r => r.some(Boolean))
      setHeaders(hdrs)
      setRows(dataRows)
      // Auto-map
      const auto = {}
      FIELDS.forEach(({ key }) => {
        const match = hdrs.find(h =>
          h.toLowerCase().replace(/\s/g, '').includes(key.toLowerCase()) ||
          key.toLowerCase().includes(h.toLowerCase().replace(/\s/g, ''))
        )
        if (match) auto[key] = match
      })
      setMapping(auto)
      setStep(2)
    }
    reader.readAsBinaryString(file)
  }

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Company Number','Device Name','Brand','Model Number','Serial Number','Device Type','Department','Location','Status','Assigned To','Purchase Date','Notes'],
      ['IT-001','MacBook Pro 14"','Apple','MBP14-M2-2023','C02XK1JXLVDQ','Laptop','IT','Main Office','Active','Jane Smith','2023-03-15',''],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Assets')
    XLSX.writeFile(wb, 'assettrack_template.xlsx')
  }

  const handleImport = () => {
    const assets = rows
      .map(row => {
        const asset = { id: generateId(), status: 'Active' }
        FIELDS.forEach(({ key }) => {
          const idx = headers.indexOf(mapping[key] || '')
          asset[key] = idx >= 0 ? String(row[idx] ?? '') : ''
        })
        return asset
      })
      .filter(a => a.serial || a.name)
    onImport(assets)
  }

  return (
    <div>
      {step === 1 && (
        <>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <p className={styles.tipTitle}>Import Tips</p>
              <p className={styles.tipBody}>
                Upload an Excel (.xlsx) or CSV file. Column headers will be auto-matched to fields.
                Download our template for the easiest experience.
              </p>
            </div>
          </div>
          <button className={styles.templateBtn} onClick={downloadTemplate}>
            📥 Download Template
          </button>
          <div className={styles.dropzone} onClick={() => fileRef.current.click()}>
            <div className={styles.dropIcon}>📂</div>
            <p className={styles.dropTitle}>Click to select file</p>
            <p className={styles.dropSub}>Supports .xlsx, .xls, .csv</p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={handleFile}
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className={styles.success}>
            ✅ <strong>{rows.length} rows detected.</strong> Map your columns below.
          </div>
          <div className={styles.mapGrid}>
            {FIELDS.map(({ key, label }) => (
              <div key={key} className={styles.mapField}>
                <label className={styles.mapLabel}>{label}</label>
                <select
                  className={styles.mapSelect}
                  value={mapping[key] || ''}
                  onChange={e => setMapping(m => ({ ...m, [key]: e.target.value }))}
                >
                  <option value="">— skip —</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className={styles.previewWrap}>
            <table className={styles.previewTable}>
              <thead>
                <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(0, 4).map((r, i) => (
                  <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.actions}>
            <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
            <button className={styles.importBtn} onClick={handleImport}>
              Import {rows.length} Assets
            </button>
          </div>
        </>
      )}
    </div>
  )
}
