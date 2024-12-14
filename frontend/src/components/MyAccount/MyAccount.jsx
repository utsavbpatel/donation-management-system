import React, { useState, useEffect } from 'react'
import './MyAccount.css'
import InputField from '../common/InputField/InputField'
import Button from '../common/Button/Button'
import { useAuth } from '../../contexts/AuthContext'
import { useAccount } from '../../contexts/AccountContext';
import { get, post, put, remove } from '../../services/apiServices'
import { toast } from 'react-toastify'


function SetupForm() {
    const { userId, setIsSetup } = useAuth();
    const { data, setData } = useAccount();
    const [showAddOrganizationForm, setShowAddOrganizationForm] = useState(false);
    const [showEditOrganizationForm, setShowEditOrganizationForm] = useState(false);

    const [addOrganizationData, setAddOrganizationData] = useState({
        userId: userId,
        organizationName: '',
        mobileNo: '',
        emailId: '',
        address: '',
    })

    //To get organization details
    const fetchOrganizationDetails = async () => {
        try {
            if (!userId) return;
            const response = await get('/getOrganizationDetails.php', userId);
            if (response.success && response.data) {
                setIsSetup(true);
                setData(response.data);
            }
        } catch (error) {
            toast.error('Error fetching organization details:', error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchOrganizationDetails();
        }
    }, [userId]);


    //To handle add organization form open/close
    const handleAddOrganization = () => {
        setShowAddOrganizationForm(true)
    }

    const closeAddOrganization = () => {
        setShowAddOrganizationForm(false)
        setShowEditOrganizationForm(false)
    }

    //To show add organization form
    const handleEditOrganization = () => {
        setAddOrganizationData({
            userId: userId,
            organizationName: data.organizationName,
            mobileNo: data.mobileNo,
            emailId: data.emailId,
            address: data.address
        })
        setShowEditOrganizationForm(true)
    }

    //To handle add organization details form
    const handleAddOrganizationFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await post('addOrganizationDetails.php', addOrganizationData);
            if (response.success) {
                setIsSetup(true)
                setShowAddOrganizationForm(false)
                toast.success('Organization details added successfully.');
                fetchOrganizationDetails();
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //To handle edit organization details form 
    const handleEditOrganizationFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await put('editOrganizationDetails.php', addOrganizationData, userId)
            if (response.success) {
                setIsSetup(true)
                setShowEditOrganizationForm(false)
                toast.success('Organization details updated successfully.');
                fetchOrganizationDetails();
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //To remove organizations details
    const handleDeleteOrganization = async () => {
        try {
            const response = await remove('deleteOrganizationDetails.php', userId)
            if (response.success) {
                toast.success("Organization details deleted successfully.")
                setIsSetup(false);
                setAddOrganizationData({
                    userId: userId,
                    organizationName: '',
                    mobileNo: '',
                    emailId: '',
                    address: ''
                })
                setData({})
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <div className='myAccount-main-container'>
            <div className="myAccount-heading">
                <p>Account Details</p>
                <div className="myAccount-buttons-container">
                    <Button icon={data.organizationName ? <i class="fa-solid fa-pen-to-square"></i> : <i class="fa-solid fa-plus"></i>} onClick={data.organizationName ? handleEditOrganization : handleAddOrganization} />
                    {data.organizationName && <Button icon={<i class="fa-solid fa-trash"></i>} onClick={handleDeleteOrganization} />}
                </div>
            </div>
            <div className="myAccount-content">
                <table>
                    <thead>
                        <tr>
                            <th>Organization Name</th>
                            <td>{data.organizationName}</td>
                        </tr>
                        <tr>
                            <th>Mobile No.</th>
                            <td>{data.mobileNo}</td>
                        </tr>
                        <tr>
                            <th>Email Id</th>
                            <td>{data.emailId}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{data.address}</td>
                        </tr>
                    </thead>
                </table>
            </div>


            {(showAddOrganizationForm || showEditOrganizationForm) &&
                <div className='addOrganization-form-container'>
                    <div className="addOrganization-form-content">
                        <div className="addOrganization-form-heading">
                            <p>{showEditOrganizationForm ? 'Edit Account Details' : 'Add Account Details'}</p>
                            <i className='fa solid fa-xmark' onClick={closeAddOrganization}></i>
                        </div>
                        <div className="addOrganization-form-inputs">
                            <form onSubmit={showEditOrganizationForm ? handleEditOrganizationFormSubmit : handleAddOrganizationFormSubmit} className='addOrganization-form'>
                                <InputField type='text' value={addOrganizationData.organizationName} onChange={(e) => setAddOrganizationData({ ...addOrganizationData, organizationName: e.target.value })} placeholder='Organization Name' />
                                <InputField type='number' value={addOrganizationData.mobileNo} onChange={(e) => setAddOrganizationData({ ...addOrganizationData, mobileNo: parseInt(e.target.value) })} placeholder='Mobile No.' />
                                <InputField type='email' value={addOrganizationData.emailId} onChange={(e) => setAddOrganizationData({ ...addOrganizationData, emailId: e.target.value })} placeholder='Email ID' />
                                <InputField type='text' value={addOrganizationData.address} onChange={(e) => setAddOrganizationData({ ...addOrganizationData, address: e.target.value })} placeholder='Address' />
                                <Button text='Submit' type='submit' />
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default SetupForm