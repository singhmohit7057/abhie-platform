export type UserRole = 'admin' | 'merchant' | 'client'

export interface Profile {
  id: string
  email: string
  phone: string | null
  full_name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  is_active: boolean
  created_at: string
}

export interface Merchant {
  id: string
  user_id: string
  store_name: string
  business_type: string | null
  gst_number: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  commission_rate: number
  is_active: boolean
  created_at: string
}

export interface Store {
  id: string
  merchant_id: string
  name: string
  address: string | null
  city: string | null
  pincode: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}

export interface Card {
  id: string
  card_number: string
  client_id: string | null
  merchant_id: string | null
  card_type: string
  balance: number
  points: number
  is_active: boolean
  valid_from: string
  valid_until: string
  created_at: string
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  city: string | null
  pincode: string | null
  card_id: string | null
  merchant_id: string | null
  created_at: string
}

export interface Voucher {
  id: string
  code: string
  title: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_uses: number
  used_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  title: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  applicable_category_id: string | null
  min_order_amount: number
  max_uses: number
  used_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  created_at: string
}

export interface Item {
  id: string
  name: string
  description: string | null
  category_id: string | null
  price: number
  mrp: number
  discount_percentage: number
  image_url: string | null
  stock_quantity: number
  is_active: boolean
  merchant_id: string | null
  approval_status: 'approved' | 'pending' | 'rejected'
  created_at: string
}

export interface Payment {
  id: string
  order_id: string | null
  merchant_id: string | null
  client_id: string | null
  amount: number
  payment_mode: 'cash' | 'upi' | 'card' | 'netbanking'
  status: 'pending' | 'completed' | 'failed'
  transaction_id: string | null
  created_at: string
}

export interface Booking {
  id: string
  client_id: string | null
  merchant_id: string | null
  service_name: string
  booking_date: string
  time_slot: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  amount: number
  created_at: string
}

export interface Ticket {
  id: string
  booking_id: string
  ticket_number: string
  event_name: string
  seat_info: string | null
  is_used: boolean
  created_at: string
}

export interface Order {
  id: string
  client_id: string | null
  merchant_id: string | null
  items: Record<string, unknown>[]
  total_amount: number
  discount_applied: number
  final_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

export interface Redemption {
  id: string
  card_id: string | null
  client_id: string | null
  merchant_id: string | null
  voucher_id: string | null
  points_redeemed: number
  amount_redeemed: number
  created_at: string
}

export interface Complaint {
  id: string
  user_id: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  resolved_at: string | null
}

export interface Feedback {
  id: string
  user_id: string
  merchant_id: string | null
  rating: number
  comment: string | null
  created_at: string
}

export interface AuditEntry {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface Settlement {
  id: string
  merchant_id: string
  amount: number
  period_from: string
  period_to: string
  status: 'pending' | 'processed'
  processed_at: string | null
  created_at: string
}
