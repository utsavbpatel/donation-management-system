import React, { useState, useEffect } from 'react'
import './SignIn.css'
import InputField from '../common/InputField/InputField'
import Button from '../common/Button/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { post } from '../../services/apiServices'
import { toast } from 'react-toastify'

function SignIn() {
    const [signinData, setSigninData] = useState({
        email: "",
        password: ""
    })
    const { setIsActive, setUserId } = useAuth();
    const navigate = useNavigate();

    //To handle signin
    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            const response = await post("signin.php", signinData)

            if (response.userId) {
                setUserId(response.userId)
                toast.success('SignIn Successful.')
                navigate('/dashboard')
                setIsActive(true)
            } else {
                toast.error('SignIn Failed: ' + (response.error));
            }

            setSigninData({
                email: '',
                password: ''
            })
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='signin-main-container'>
            <div className="signin-form-container">
                <div className="signin-form-heading">
                    <h2 className='colorfont'>Donation Management System</h2>
                    <h2 className='semiheader'>Sign In</h2>
                </div>
                <form className='signin-form' onSubmit={handleSignin}>
                    <InputField type='email' value={signinData.email} onChange={(e) => setSigninData({ ...signinData, email: e.target.value })} placeholder='Email' />
                    <InputField type='password' value={signinData.password} onChange={(e) => setSigninData({ ...signinData, password: e.target.value })} placeholder='Password' />
                    <Button text='Sign In' type='submit' />
                </form>
                <div className="signin-other-links">
                    <p>Don't have account?<Link to='/signup' className='bold'> Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default SignIn