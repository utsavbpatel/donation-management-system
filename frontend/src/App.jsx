import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import AddDonation from './components/AddDonation/AddDonation';
import DonationCategories from './components/DonationCategories/DonationCategories';
import MyAccount from './components/MyAccount/MyAccount'
import './App.css';
import { useAuth } from './contexts/AuthContext';
import { useAccount } from './contexts/AccountContext';
import { get } from './services/apiServices';
import Layout from './Layout';


function App() {
  const { isActive, userId, isSetup, setIsSetup } = useAuth();
  const { data, setData } = useAccount();
  const [loading, setLoading] = useState(false);

  //To get organization details
  const fetchOrganizationDetails = async () => {
    setLoading(true)
    try {
      if (!userId) return;
      const response = await get('/getOrganizationDetails.php', userId);
      if (response.success && response.data) {
        setIsSetup(true);
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching organization details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrganizationDetails();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isActive ? <Navigate to="/dashboard" /> : <SignIn />} index />
        <Route path="/signup" element={isActive ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/" element={isActive ? <Layout /> : <Navigate to="/" />}>
          <Route path="dashboard" element={isSetup ? <Dashboard /> : <Navigate to="/myaccount" />} />
          <Route path="adddonation" element={isSetup ? <AddDonation /> : <Navigate to="/myaccount" />} />
          <Route path="donationcategories" element={isSetup ? <DonationCategories /> : <Navigate to="/myaccount" />} />
          <Route path="myaccount" element={<MyAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
