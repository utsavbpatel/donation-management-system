import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import { useAuth } from '../../contexts/AuthContext'
import { useAccount } from '../../contexts/AccountContext.jsx';
import { useNavigate, Navigate } from 'react-router-dom';
import Button from '../common/Button/Button';
import { toast } from 'react-toastify';
import { get } from '../../services/apiServices.js';


function Dashboard() {
  const { setIsActive, isSetup, setIsSetup, userId, setUserId } = useAuth();
  const navigate = useNavigate();
  const { data, setData } = useAccount();
  const [allDonationsData, setAllDonationsData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalWithCategory, setTotalWithCategory] = useState({})

  //To get donation details
  const fetchDonations = async () => {
    try {
      const response = await get('getDonations.php', userId)
      if (response.success) {
        setAllDonationsData(response.data);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDonations();
  }, [])

  //To get total amount, category wise
  useEffect(() => {
    const total = allDonationsData.reduce(
      (prev, donation) => prev + Number(donation.donationAmount), 0
    );
    setTotalAmount(total);

    const totalsByCategory = allDonationsData.reduce((acc, donation) => {
      const category = donation.donationTypeName;
      const amount = Number(donation.donationAmount || 0);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
    setTotalWithCategory(totalsByCategory);
  }, [allDonationsData]);


  return (
    <div className='dashboard-main-container'>
      <div className="dashboard-heading">
        <p>DashBoard</p>
      </div>
      <div className="dashboard-content">

        <p className='heading'>Total Donation Collection</p>
        <div className="dashboard-card-container1">
          <p className='semiheading'>Total Donation Collection </p>
          <p className='semi-bold'>Rs. {totalAmount}</p>
        </div>


        <p className='heading'>Category Wise Total Collection</p>
        <div className="dashboard-card-container2">
          {Object.entries(totalWithCategory).sort((a, b) => b[1] - a[1]).map(([category, amount]) => (
            <div key={category} className='dashboard-card-container3'>
              <p className='semiheading'>{category}</p>
              <p className='semi-bold'>Rs. {amount}</p>
            </div>
          ))}
        </div>


      </div>

    </div>
  )
}

export default Dashboard