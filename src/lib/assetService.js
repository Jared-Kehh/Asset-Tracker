import { supabase } from './supabase'

// ── Map DB row (snake_case) → app object (camelCase) ───────────────────────
const toApp = row => ({
  id:            row.id,
  companyNumber: row.company_number,
  name:          row.name,
  brand:         row.brand,
  model:         row.model,
  serial:        row.serial,
  type:          row.type,
  department:    row.department,
  location:      row.location,
  status:        row.status,
  assignedTo:    row.assigned_to,
  purchaseDate:  row.purchase_date,
  notes:         row.notes,
})

// ── Map app object (camelCase) → DB row (snake_case) ───────────────────────
const toDB = asset => ({
  id:             asset.id,
  company_number: asset.companyNumber,
  name:           asset.name,
  brand:          asset.brand,
  model:          asset.model,
  serial:         asset.serial,
  type:           asset.type,
  department:     asset.department,
  location:       asset.location,
  status:         asset.status,
  assigned_to:    asset.assignedTo,
  purchase_date:  asset.purchaseDate,
  notes:          asset.notes,
})

// ── Fetch all assets ────────────────────────────────────────────────────────
export async function fetchAssets() {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('company_number', { ascending: true })

  if (error) throw error
  return data.map(toApp)
}

// ── Insert one asset ────────────────────────────────────────────────────────
export async function insertAsset(asset) {
  const { data, error } = await supabase
    .from('assets')
    .insert(toDB(asset))
    .select()
    .single()

  if (error) throw error
  return toApp(data)
}

// ── Update one asset ────────────────────────────────────────────────────────
export async function updateAsset(asset) {
  const { data, error } = await supabase
    .from('assets')
    .update(toDB(asset))
    .eq('id', asset.id)
    .select()
    .single()

  if (error) throw error
  return toApp(data)
}

// ── Delete one asset ────────────────────────────────────────────────────────
export async function deleteAsset(id) {
  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ── Bulk insert (for Excel import) ──────────────────────────────────────────
export async function bulkInsertAssets(assets) {
  const { data, error } = await supabase
    .from('assets')
    .insert(assets.map(toDB))
    .select()

  if (error) throw error
  return data.map(toApp)
}
