import { useState } from 'react'
import { BRANDS, DEVICE_TYPES, DEPARTMENTS, LOCATIONS, STATUS_OPTIONS } from '../../constants'
import styles from './AssetForm.module.css'

const BLANK = {
  companyNumber: '', name: '', brand: '', model: '', serial: '',
  type: 'Laptop', department: '', location: '', status: 'Active',
  notes: '', assignedTo: '', purchaseDate: '',
}

export default function AssetForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || BLANK)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name || !form.serial || !form.companyNumber) {
      alert('Company #, Device Name, and Serial Number are required.')
      return
    }
    onSave(form)
  }

  return (
    <div className={styles.form}>
      <div className={styles.grid}>
        <Field label="Company Number *">
          <input className={styles.input} value={form.companyNumber} onChange={e => set('companyNumber', e.target.value)} placeholder="e.g. IT-042" />
        </Field>
        <Field label="Device Name *">
          <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. MacBook Pro 14" />
        </Field>
        <Field label="Brand">
          <select className={styles.input} value={form.brand} onChange={e => set('brand', e.target.value)}>
            <option value="">Select brand…</option>
            {BRANDS.map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Device Type">
          <select className={styles.input} value={form.type} onChange={e => set('type', e.target.value)}>
            {DEVICE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Model Number">
          <input className={styles.input} value={form.model} onChange={e => set('model', e.target.value)} placeholder="e.g. MBP14-M2-2023" />
        </Field>
        <Field label="Serial Number *">
          <input className={styles.input} value={form.serial} onChange={e => set('serial', e.target.value)} placeholder="e.g. C02XK1JXLVDQ" />
        </Field>
        <Field label="Department">
          <select className={styles.input} value={form.department} onChange={e => set('department', e.target.value)}>
            <option value="">Select dept…</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <select className={styles.input} value={form.location} onChange={e => set('location', e.target.value)}>
            <option value="">Select location…</option>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Assigned To">
          <input className={styles.input} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)} placeholder="Employee name" />
        </Field>
        <Field label="Status">
          <select className={styles.input} value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Purchase Date">
          <input type="date" className={styles.input} value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} />
        </Field>
        <Field label="Notes" full>
          <textarea className={`${styles.input} ${styles.textarea}`} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes…" />
        </Field>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} onClick={handleSubmit}>Save Asset</button>
      </div>
    </div>
  )
}

function Field({ label, children, full }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ''}`}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}
