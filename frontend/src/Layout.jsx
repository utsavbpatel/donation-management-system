import React from 'react'
import './Layout.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Topbar from './components/Topbar/Topbar'

function Layout() {
    return (
        <div className='layout-container'>
            <div className='part-1'>
                <Navbar />
            </div>
            <div className='part-2'>
                <div className='topbar'>
                    <Topbar />
                </div>
                <div className='outlet'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout;