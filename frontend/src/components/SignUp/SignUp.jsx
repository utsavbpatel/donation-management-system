import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../SignIn/SignIn.css'
import InputField from '../common/InputField/InputField'
import Button from '../common/Button/Button'
import { useAuth } from '../../contexts/AuthContext'
import { post } from '../../services/apiServices'
import { toast } from 'react-toastify'

function SignUp() {
  const [signupData, setSignupData] = useState({
    email: '',
    password: ''
  })
  const [reenteredPassword, setReenteredPassword] = useState('');
  const { setIsActive, setUserId } = useAuth();
  const navigate = useNavigate();

  //To handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== reenteredPassword) {
      toast.error("Password doesn't match.");
      return;
    }

    try {
      const userId = `USER${Date.now()}`;
      const finalSignupData = { ...signupData, userId: userId }
      const response = await post("signup.php", finalSignupData)

      if (response.userId) {
        setUserId(response.userId)
        toast.success('SignUp Successful.')
        navigate('/dashboard')
        setIsActive(true)
      } else {
        toast.error('SignUp Failed: ' + (response.error));
      }

      setSignupData({
        email: '',
        password: ''
      })
      setReenteredPassword('')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="signin-main-container">
      <div className="signin-form-container">
        <div className="signin-form-heading">
          <h2 className='colorfont'>Donation Management System</h2>
          <h2 className='semiheader'>Sign Up</h2>
        </div>
        <form onSubmit={handleSignup} className="signin-form">
          <InputField type='email' value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} placeholder='Email' />
          <InputField type='password' value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} placeholder='Password' />
          <InputField type='password' value={reenteredPassword} onChange={(e) => setReenteredPassword(e.target.value)} placeholder='Re-enter Password' />
          <Button text='Sign Up' type='submit' />
        </form>
        <div className="signin-other-links">
          <p>Already have an account?<Link to='/' className='bold'> Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignUp