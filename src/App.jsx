import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/Layout';
import Dashboard from '@/components/pages/Dashboard';
import MyCities from '@/components/pages/MyCities';
import DirectoryBuilder from '@/components/pages/DirectoryBuilder';
import AdsRevenue from '@/components/pages/AdsRevenue';
import Analytics from '@/components/pages/Analytics';
import Settings from '@/components/pages/Settings';
import AdminPanel from '@/components/pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cities" element={<MyCities />} />
            <Route path="builder" element={<DirectoryBuilder />} />
            <Route path="ads" element={<AdsRevenue />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="admin/users" element={<AdminPanel />} />
            <Route path="admin/cities" element={<AdminPanel />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;