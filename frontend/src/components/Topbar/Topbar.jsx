import React from 'react'
import './Topbar.css'
import { useAccount } from '../../contexts/AccountContext'
import Button from '../common/Button/Button'

function Topbar() {
  const { data } = useAccount();

  return (
    <div className='topbar-main-container'>
      <p>Welcome, {data.organizationName} </p>
    </div>
  )
}

export default Topbar