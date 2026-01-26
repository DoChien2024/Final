import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import GlobalConfirmDialog from './components/ui/GlobalConfirmDialog'

import { Dashboard } from './modules/dashboard'
import { Articles } from './modules/articles'
import { TransactionPage } from './modules/transactions'
import { Categories } from './modules/categories'
import { Users } from './modules/users'
import { DoulaManagement, DoulaView, PackageView } from './modules/doulas'
import { ClientManagement, ClientView } from './modules/clients'
import { Vouchers, VoucherView } from './modules/vouchers'
import { PDSession } from './modules/pd-sessions'
import { HelpDocuments } from './modules/help-documents'
import { SearchSettings } from './modules/search-settings'
import { NotFound } from './modules/common'
import { AccountLayout } from './modules/account'

function App() {
  return (
    <>
      <Routes>
      {/* Root - Redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public */}
      <Route path="/login" element={<PublicRoute />} />
      
      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Content Management */}
        <Route path="/articles" element={<Articles />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/help-documents" element={<HelpDocuments />} />
        
        {/* Account Management Wrapper */}
        <Route path="/account" element={<AccountLayout />}>
          {/* User Management */}
          <Route path="users" element={<Users />} />
          <Route path="admin-management" element={<Users />} />
          <Route path="doula-management" element={<DoulaManagement />} />
          <Route path="doula-management/:id/view" element={<DoulaView />} />
          <Route path="doula-management/packages/:packageId" element={<PackageView />} />
          <Route path="client-management" element={<ClientManagement />} />
          <Route path="client-management/:id/view" element={<ClientView />} />
        </Route>
        
        {/* Business Management */}
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/vouchers/:id/view" element={<VoucherView />} />
        <Route path="/pd-session" element={<PDSession />} />
        
        {/* System Settings */}
        <Route path="/search-settings" element={<SearchSettings />} />
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    
    {/* Global Confirm Dialog */}
    <GlobalConfirmDialog />
    </>
  )
}

export default App