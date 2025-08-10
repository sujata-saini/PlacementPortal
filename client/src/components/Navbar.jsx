import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk,UserButton,useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Navbar = () => {
  const {openSignIn}=useClerk()
  const{user}=useUser()
  const navigate =useNavigate()

  const{setShowRecruiterLogin}=useContext(AppContext)
  return (
    <div className="shadow py-4 bg-white">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img  onClick={()=>navigate('/')} className='curor-pointer h-10'src={assets.logo} alt="Logo"  />
        {
          user ?<div className='flex items-center gap-3'>
            <Link to ={'/applications'}>Applied jobs</Link>
            <p>|</p>
            <p>Hi,{user.firstName+" "+user.lastName}</p>
            <UserButton></UserButton>
          </div>
          :
            <div className="flex gap-4">
          <button  onClick={e=>setShowRecruiterLogin(true)}className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Recruiter Login
          </button>
          <button onClick={e =>openSignIn()}className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
            Login
          </button>
        </div>
        }
      
      </div>
    </div>
  )
}

export default Navbar
