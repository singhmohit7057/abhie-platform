import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthGuard } from './auth/AuthGuard'
import { Login } from './auth/Login'
import { ForgotPassword } from './auth/ForgotPassword'
import { AdminLayout } from './components/layout/AdminLayout'
import { Dashboard } from './admin/Dashboard'
import { ViewCategories } from './admin/categories/ViewCategories'
import { AddCategory } from './admin/categories/AddCategory'
import { ViewMerchants } from './admin/merchants/ViewMerchants'
import { AddMerchant } from './admin/merchants/AddMerchant'
import { ViewCards } from './admin/cards/ViewCards'
import { AddCards } from './admin/cards/AddCards'
import { ViewClients } from './admin/clients/ViewClients'
import { ViewVouchers } from './admin/vouchers/ViewVouchers'
import { AddVoucher } from './admin/vouchers/AddVoucher'
import { ViewCoupons } from './admin/coupons/ViewCoupons'
import { AddCoupon } from './admin/coupons/AddCoupon'
import { ViewItems } from './admin/items/ViewItems'
import { AddItem } from './admin/items/AddItem'
import { ViewPayments } from './admin/payments/ViewPayments'
import { AddPayment } from './admin/payments/AddPayment'
import { ViewBookings } from './admin/bookings/ViewBookings'
import { UserOrders } from './admin/orders/UserOrders'
import { Reports } from './admin/reports/Reports'
import { AuditTrail } from './admin/audit/AuditTrail'
import { ViewComplaints } from './admin/feedback/ViewComplaints'
import { ViewFeedbacks } from './admin/feedback/ViewFeedbacks'
import { ChangePassword } from './admin/accounts/ChangePassword'
import { EditAccount } from './admin/accounts/EditAccount'
import { MerchantLayout } from './components/layout/MerchantLayout'
import { MerchantDashboard } from './merchant/Dashboard'
import { ManageStores } from './merchant/stores/ManageStores'
import { AddStore } from './merchant/stores/AddStore'
import { ManageClients as MerchantManageClients } from './merchant/clients/ManageClients'
import { AddClient } from './merchant/clients/AddClient'
import { MerchantViewItems } from './merchant/items/ViewItems'
import { ManageBilling } from './merchant/billing/ManageBilling'
import { AddBilling } from './merchant/billing/AddBilling'
import { MerchantViewCards } from './merchant/cards/ViewCards'
import { ManageRedemption } from './merchant/redemption/ManageRedemption'
import { MerchantReports } from './merchant/reports/MerchantReports'
import { MerchantFeedback } from './merchant/feedback/MerchantFeedback'
import { MerchantChangePassword } from './merchant/accounts/ChangePassword'
import { StoreLayout } from './components/layout/StoreLayout'
import { StoreHome } from './store/Home'
import { Catalog } from './store/Catalog'
import { ProductDetail } from './store/ProductDetail'
import { CartPage } from './store/Cart'
import { Checkout } from './store/Checkout'
import { Account } from './store/Account'
import { Wishlist } from './store/Wishlist'
import { About } from './store/About'
import { Contact } from './store/Contact'
import { Terms } from './store/Terms'
import { Privacy } from './store/Privacy'
import { Cookies } from './store/Cookies'
import { Shipping } from './store/Shipping'
import { Returns } from './store/Returns'
import { AbhiePlus } from './store/AbhiePlus'
import { Signup } from './auth/Signup'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login variant="store" />} />
        <Route path="/admin/login" element={<Login variant="admin" />} />
        <Route path="/merchant/login" element={<Login variant="merchant" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AuthGuard requiredRole="admin">
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<ViewCategories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="merchants" element={<ViewMerchants />} />
          <Route path="merchants/add" element={<AddMerchant />} />
          <Route path="cards" element={<ViewCards />} />
          <Route path="cards/add" element={<AddCards />} />
          <Route path="clients" element={<ViewClients />} />
          <Route path="vouchers" element={<ViewVouchers />} />
          <Route path="vouchers/add" element={<AddVoucher />} />
          <Route path="coupons" element={<ViewCoupons />} />
          <Route path="coupons/add" element={<AddCoupon />} />
          <Route path="items" element={<ViewItems />} />
          <Route path="items/add" element={<AddItem />} />
          <Route path="payments" element={<ViewPayments />} />
          <Route path="payments/add" element={<AddPayment />} />
          <Route path="bookings" element={<ViewBookings />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="feedback" element={<ViewComplaints />} />
          <Route path="feedback/feedbacks" element={<ViewFeedbacks />} />
          <Route path="accounts/password" element={<ChangePassword />} />
          <Route path="accounts/edit" element={<EditAccount />} />
        </Route>

        {/* Merchant Routes */}
        <Route
          path="/merchant"
          element={
            <AuthGuard requiredRole="merchant">
              <MerchantLayout />
            </AuthGuard>
          }
        >
          <Route index element={<MerchantDashboard />} />
          <Route path="stores" element={<ManageStores />} />
          <Route path="stores/add" element={<AddStore />} />
          <Route path="clients" element={<MerchantManageClients />} />
          <Route path="clients/add" element={<AddClient />} />
          <Route path="items" element={<MerchantViewItems />} />
          <Route path="billing" element={<ManageBilling />} />
          <Route path="billing/add" element={<AddBilling />} />
          <Route path="cards" element={<MerchantViewCards />} />
          <Route path="redemption" element={<ManageRedemption />} />
          <Route path="reports" element={<MerchantReports />} />
          <Route path="feedback" element={<MerchantFeedback />} />
          <Route path="accounts/password" element={<MerchantChangePassword />} />
          <Route path="accounts/edit" element={<EditAccount />} />
        </Route>

        {/* Store Routes (public) */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<StoreHome />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="account" element={<Account />} />
          <Route path="account/orders" element={<Account />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="cookies" element={<Cookies />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="returns" element={<Returns />} />
          <Route path="plus" element={<AbhiePlus />} />
        </Route>

        <Route path="/unauthorized" element={<div className="flex h-screen items-center justify-center"><p className="text-lg text-red-600">Unauthorized Access</p></div>} />
      </Routes>
    </BrowserRouter>
  )
}
