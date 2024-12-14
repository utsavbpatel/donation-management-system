import React, { useEffect, useState } from 'react'
import './DonationCategories.css'
import { useAuth } from '../../contexts/AuthContext';
import { get, post, put, remove } from '../../services/apiServices';
import Button from '../common/Button/Button';
import InputField from '../common/InputField/InputField';
import { toast } from 'react-toastify'

function DonationCategories() {
  const { userId } = useAuth();
  const [showAddDonationCategoriesForm, setShowAddDonationCategoriesForm] = useState(false);
  const [showEditDonationCategoriesForm, setShowEditDonationCategoriesForm] = useState(false);
  const [addDonationCategoriesData, setAddDonationCategoriesData] = useState({
    userId: userId,
    donationTypeName: ''
  })
  const [allDonationCategoriesData, setAllDonationCategoriesData] = useState([])

  //To get donation categories
  const fetchDonationCategories = async () => {
    try {
      const response = await get('getDonationCategories.php', userId)
      if (response.success) {
        setAllDonationCategoriesData(response.data)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchDonationCategories();
  }, [])


  //To handle add donation categories form open/close
  const handleAddDonationCategories = () => {
    setShowAddDonationCategoriesForm(true);
  }
  const closeAddDonationCategoriesForm = () => {
    setShowAddDonationCategoriesForm(false);
    setShowEditDonationCategoriesForm(false)
  }


  // To handle add donation form submission
  const handleAddDonationCategoriesForm = async (e) => {
    e.preventDefault();
    try {
      const finalAddDonationCategoriesData = { ...addDonationCategoriesData, donationTypeId: `dc${Date.now()}` }
      const response = await post('addDonationCategories.php', finalAddDonationCategoriesData);

      if (response.success) {
        toast.success('Donation Category added successfully.')
        setShowAddDonationCategoriesForm(false);
        setAddDonationCategoriesData({
          userId: userId,
          donationTypeName: '',
          donationTypeId: '',
        })
        fetchDonationCategories();
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //To show edit donation categories form
  const handleEditDonationCategories = (data) => {
    setAddDonationCategoriesData({
      donationTypeId: data.donationTypeId,
      donationTypeName: data.donationTypeName,
      userId: userId
    })
    setShowEditDonationCategoriesForm(true);
  }

  //To handle edit donation categories form
  const handleEditDonationCategoriesForm = async (e) => {
    e.preventDefault();
    try {
      const response = await put('editDonationCategories.php', addDonationCategoriesData, userId)
      if (response.success) {
        toast.success('Donation category updated successfully.')
        setShowEditDonationCategoriesForm(false);
        fetchDonationCategories();
        setAddDonationCategoriesData({
          userId: userId,
          donationTypeName: '',
          donationTypeId: '',
        })
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //To handle remove donation categories
  const handleRemoveDonationCategories = async (categoryId) => {
    try {
      const response = await remove('deleteDonationCategories.php', userId, categoryId);

      if (response.success) {
        toast.success("Donation category deleted successfully.")
        fetchDonationCategories();
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='donationCategories-main-container'>
      <div className="donationCategories-heading">
        <p>Donation Categories</p>
        <Button icon={<i class="fa-solid fa-plus"></i>} onClick={handleAddDonationCategories} />
      </div>
      <div className="donationCategories-content">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Donation Category ID</th>
              <th>Donation Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allDonationCategoriesData.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.donationTypeId}</td>
                <td>{data.donationTypeName}</td>
                <td>
                  <div className='table-actionicons'>
                    <i className='fa-solid fa-edit' onClick={() => handleEditDonationCategories(data)} />
                    <i className='fa-solid fa-trash' onClick={() => handleRemoveDonationCategories(data.donationTypeId)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddDonationCategoriesForm || showEditDonationCategoriesForm) &&
        <div className='addDonationCategories-form-container'>
          <div className="addDonationCategories-form-content">
            <div className="addDonationCategories-form-heading">
              <p>{showEditDonationCategoriesForm ? 'Edit Donation Category Details' : "Add Donation Category Details"}</p>
              <i className='fa solid fa-xmark' onClick={closeAddDonationCategoriesForm}></i>
            </div>
            <div className="addDonationCategories-form-inputs">
              <form onSubmit={showEditDonationCategoriesForm ? handleEditDonationCategoriesForm : handleAddDonationCategoriesForm} className='addDonationCategories-form'>
                <InputField type='text' value={addDonationCategoriesData.donationTypeName} onChange={(e) => setAddDonationCategoriesData({ ...addDonationCategoriesData, donationTypeName: e.target.value })} placeholder='Donation Type' />
                <Button text='Submit' type='submit' />
              </form>
            </div>
          </div>
        </div>}


    </div>
  )
}

export default DonationCategories