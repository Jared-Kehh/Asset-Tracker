export const DEPARTMENTS = [
  'Administration', 'Finance', 'HR', 'IT', 'Marketing',
  'Operations', 'Programs', 'Development', 'Facilities', 'Communications',
]

export const LOCATIONS = [
  'Main Office', 'Branch North', 'Branch South',
  'Warehouse', 'Remote', 'Community Center', 'Storage',
]

export const BRANDS = [
  'Apple', 'Dell', 'HP', 'Lenovo', 'Microsoft',
  'Samsung', 'Canon', 'Epson', 'Cisco', 'Logitech', 'Other',
]

export const DEVICE_TYPES = [
  'Laptop', 'Desktop', 'Monitor', 'Printer', 'Scanner',
  'Phone', 'Tablet', 'Router', 'Switch', 'Projector',
  'Camera', 'Keyboard', 'Mouse', 'Other',
]

export const STATUS_OPTIONS = [
  'Active', 'In Storage', 'In Repair', 'Retired', 'Missing',
]

export const STATUS_COLORS = {
  Active:     { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  'In Storage':{ bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  'In Repair':{ bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  Retired:    { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' },
  Missing:    { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
}

export const INITIAL_ASSETS = [
  {
    id: '1', companyNumber: 'IT-001', name: 'MacBook Pro 14"',
    brand: 'Apple', model: 'MBP14-M2-2023', serial: 'C02XK1JXLVDQ',
    type: 'Laptop', department: 'IT', location: 'Main Office',
    status: 'Active', notes: 'Primary dev machine', assignedTo: 'Jane Smith', purchaseDate: '2023-03-15',
  },
  {
    id: '2', companyNumber: 'HR-004', name: 'Dell Latitude',
    brand: 'Dell', model: 'Latitude 5530', serial: '6FKPL93',
    type: 'Laptop', department: 'HR', location: 'Main Office',
    status: 'Active', notes: '', assignedTo: 'Bob Lee', purchaseDate: '2022-11-01',
  },
  {
    id: '3', companyNumber: 'FIN-002', name: 'HP LaserJet',
    brand: 'HP', model: 'LaserJet Pro M404dn', serial: 'VNG9Q12345',
    type: 'Printer', department: 'Finance', location: 'Branch North',
    status: 'In Repair', notes: 'Paper jam issues', assignedTo: '', purchaseDate: '2021-06-20',
  },
  {
    id: '4', companyNumber: 'OPS-007', name: 'Lenovo ThinkPad',
    brand: 'Lenovo', model: 'ThinkPad X1 Carbon', serial: 'PF2XY901',
    type: 'Laptop', department: 'Operations', location: 'Branch South',
    status: 'Active', notes: '', assignedTo: 'Maria Garcia', purchaseDate: '2023-07-10',
  },
  {
    id: '5', companyNumber: 'IT-012', name: 'Cisco Switch',
    brand: 'Cisco', model: 'Catalyst 2960', serial: 'FDO1234X5YZ',
    type: 'Switch', department: 'IT', location: 'Warehouse',
    status: 'In Storage', notes: 'Spare unit', assignedTo: '', purchaseDate: '2020-01-15',
  },
  {
    id: '6', companyNumber: 'MKT-003', name: 'Canon EOS Camera',
    brand: 'Canon', model: 'EOS R50', serial: 'CR50-88231',
    type: 'Camera', department: 'Marketing', location: 'Main Office',
    status: 'Active', notes: '', assignedTo: 'Alex Torres', purchaseDate: '2023-09-01',
  },
]

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
