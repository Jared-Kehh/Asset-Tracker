import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { supabase }      from './lib/supabase'
import { fetchAssets, insertAsset, updateAsset, deleteAsset, bulkInsertAssets } from './lib/assetService'
import { generateId, DEPARTMENTS, LOCATIONS, STATUS_OPTIONS } from './constants'
import LoginPage     from './components/auth/LoginPage'
import Modal         from './components/ui/Modal'
import Badge         from './components/ui/Badge'
import AssetForm     from './components/asset/AssetForm'
import AssetTable    from './components/asset/AssetTable'
import AssetDetail   from './components/asset/AssetDetail'
import BarcodeScanner from './components/modals/BarcodeScanner'
import ImportModal   from './components/modals/ImportModal'
import Dashboard     from './components/modals/Dashboard'
import styles from './App.module.css'

export default function App() {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [session,  setSession]  = useState(undefined)   // undefined = loading

  // ── App state ──────────────────────────────────────────────────────────────
  const [assets,        setAssets]        = useState([])
  const [loading,       setLoading]       = useState(false)
  const [dbError,       setDbError]       = useState('')
  const [search,        setSearch]        = useState('')
  const [filterDept,    setFilterDept]    = useState('')
  const [filterLoc,     setFilterLoc]     = useState('')
  const [filterStatus,  setFilterStatus]  = useState('')
  const [sortBy,        setSortBy]        = useState('companyNumber')
  const [activeTab,     setActiveTab]     = useState('assets')
  const [modal,         setModal]         = useState(null)
  const [editAsset,     setEditAsset]     = useState(null)
  const [viewAsset,     setViewAsset]     = useState(null)
  const [scannedSerial, setScannedSerial] = useState('')
  const [toast,         setToast]         = useState(null)

  // ── Listen to Supabase auth changes ───────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Load assets when logged in ────────────────────────────────────────────
  const loadAssets = useCallback(async () => {
    setLoading(true)
    setDbError('')
    try {
      const data = await fetchAssets()
      setAssets(data)
    } catch (err) {
      setDbError('Could not load assets. Check your Supabase connection.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session) loadAssets()
    else setAssets([])
  }, [session, loadAssets])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast  = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }
  const closeModal = () => { setModal(null); setEditAsset(null) }

  // ── Derived data ───────────────────────────────────────────────────────────
  const filtered = assets
    .filter(a => {
      const q = search.toLowerCase()
      const matchQ = !q || [a.name, a.serial, a.model, a.companyNumber, a.brand, a.assignedTo]
        .some(v => v?.toLowerCase().includes(q))
      return matchQ
        && (!filterDept   || a.department === filterDept)
        && (!filterLoc    || a.location   === filterLoc)
        && (!filterStatus || a.status     === filterStatus)
    })
    .sort((a, b) => (a[sortBy] || '').localeCompare(b[sortBy] || ''))

  const stats = {
    total:   assets.length,
    active:  assets.filter(a => a.status === 'Active').length,
    repair:  assets.filter(a => a.status === 'In Repair').length,
    missing: assets.filter(a => a.status === 'Missing').length,
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSave = async form => {
    try {
      if (editAsset) {
        const updated = await updateAsset({ ...form, id: editAsset.id })
        setAssets(prev => prev.map(a => a.id === editAsset.id ? updated : a))
        showToast('Asset updated successfully.')
      } else {
        const created = await insertAsset({ ...form, id: generateId() })
        setAssets(prev => [...prev, created])
        showToast('Asset added successfully.')
      }
      closeModal()
    } catch (err) {
      showToast('Failed to save asset. Please try again.', 'error')
      console.error(err)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this asset? This cannot be undone.')) return
    try {
      await deleteAsset(id)
      setAssets(prev => prev.filter(a => a.id !== id))
      setViewAsset(null)
      showToast('Asset deleted.', 'error')
    } catch (err) {
      showToast('Failed to delete asset.', 'error')
      console.error(err)
    }
  }

  const handleEdit = asset => {
    setEditAsset(asset)
    setViewAsset(null)
    setModal('add')
  }

  const handleScanResult = serial => {
    setModal(null)
    const found = assets.find(a => a.serial.toLowerCase() === serial.toLowerCase())
    if (found) {
      setViewAsset(found)
      showToast(`Found: ${found.name}`)
    } else {
      setScannedSerial(serial)
      setEditAsset(null)
      setModal('add')
      showToast('Serial not found — fill in details to add it.', 'warn')
    }
  }

  const handleImport = async newAssets => {
    try {
      const inserted = await bulkInsertAssets(newAssets)
      setAssets(prev => [...prev, ...inserted])
      setModal(null)
      showToast(`Imported ${inserted.length} assets successfully.`)
    } catch (err) {
      showToast('Import failed. Please try again.', 'error')
      console.error(err)
    }
  }

  const exportExcel = () => {
    const data = assets.map(a => ({
      'Company Number': a.companyNumber, 'Device Name': a.name,
      'Brand': a.brand, 'Model Number': a.model, 'Serial Number': a.serial,
      'Device Type': a.type, 'Department': a.department, 'Location': a.location,
      'Status': a.status, 'Assigned To': a.assignedTo,
      'Purchase Date': a.purchaseDate, 'Notes': a.notes,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Assets')
    XLSX.writeFile(wb, 'asset_inventory.xlsx')
    showToast('Exported to Excel!')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setAssets([])
  }

  // ── Auth loading splash ────────────────────────────────────────────────────
  if (session === undefined) {
    return (
      <div className={styles.splash}>
        <div className={styles.splashLogo}>AT</div>
        <div className={styles.splashSpinner} />
      </div>
    )
  }

  // ── Not logged in → show login ─────────────────────────────────────────────
  if (!session) return <LoginPage />

  // ── Logged in → show app ───────────────────────────────────────────────────
  return (
    <div className={styles.app}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>🖥</div>
            <div>
              <div className={styles.brandName}>AssetTrack</div>
              <div className={styles.brandSub}>Nonprofit Technology Manager</div>
            </div>
          </div>
          <nav className={styles.nav}>
            {['assets', 'dashboard'].map(tab => (
              <button
                key={tab}
                className={`${styles.navBtn} ${activeTab === tab ? styles.navActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'assets' ? '📋 Assets' : '📊 Dashboard'}
              </button>
            ))}
          </nav>
          <div className={styles.headerRight}>
            <span className={styles.userEmail}>{session.user.email}</span>
            <button className={styles.signOutBtn} onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* DB error banner */}
        {dbError && (
          <div className={styles.errorBanner}>
            ⚠️ {dbError}
            <button onClick={loadAssets} className={styles.retryBtn}>Retry</button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className={styles.loadingBar}>
            <div className={styles.loadingFill} />
          </div>
        )}

        {/* Stats row */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Assets', value: stats.total,   icon: '🗂', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Active',       value: stats.active,  icon: '✅', color: '#059669', bg: '#f0fdf4' },
            { label: 'In Repair',    value: stats.repair,  icon: '🔧', color: '#d97706', bg: '#fffbeb' },
            { label: 'Missing',      value: stats.missing, icon: '⚠️', color: '#dc2626', bg: '#fef2f2' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard tab */}
        {activeTab === 'dashboard' && <Dashboard assets={assets} />}

        {/* Assets tab */}
        {activeTab === 'assets' && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  className={styles.searchInput}
                  placeholder="Search name, serial, model, company #…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select className={styles.filter} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <select className={styles.filter} value={filterLoc} onChange={e => setFilterLoc(e.target.value)}>
                <option value="">All Locations</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
              <select className={styles.filter} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <div className={styles.toolbarRight}>
                <button className={styles.btnSecondary} onClick={() => setModal('scan')}>📷 Scan</button>
                <button className={styles.btnSecondary} onClick={() => setModal('import')}>📂 Import</button>
                <button className={styles.btnSecondary} onClick={exportExcel}>📤 Export</button>
                <button className={styles.btnPrimary} onClick={() => { setEditAsset(null); setScannedSerial(''); setModal('add') }}>
                  + Add Asset
                </button>
              </div>
            </div>

            <AssetTable
              assets={filtered}
              total={assets.length}
              sortBy={sortBy}
              onSort={setSortBy}
              onView={setViewAsset}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      {/* ── Modals ── */}
      {modal === 'add' && (
        <Modal title={editAsset ? 'Edit Asset' : 'Add New Asset'} onClose={closeModal} wide>
          <AssetForm
            initial={editAsset ?? (scannedSerial ? { serial: scannedSerial } : null)}
            onSave={handleSave}
            onClose={closeModal}
          />
        </Modal>
      )}
      {modal === 'scan' && (
        <Modal title="🔍 Barcode / Serial Scanner" onClose={() => setModal(null)}>
          <BarcodeScanner onResult={handleScanResult} />
        </Modal>
      )}
      {modal === 'import' && (
        <Modal title="📂 Import Assets from Excel / CSV" onClose={() => setModal(null)} wide>
          <ImportModal onImport={handleImport} onClose={() => setModal(null)} />
        </Modal>
      )}
      {viewAsset && (
        <Modal title="Asset Details" onClose={() => setViewAsset(null)} wide>
          <AssetDetail asset={viewAsset} onEdit={handleEdit} onDelete={handleDelete} />
        </Modal>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={styles.toast} style={{
          background: toast.type === 'error' ? '#dc2626' : toast.type === 'warn' ? '#d97706' : '#059669',
        }}>
          {toast.type === 'error' ? '🗑 ' : toast.type === 'warn' ? '⚠️ ' : '✅ '}
          {toast.msg}
        </div>
      )}
    </div>
  )
}

//test commit