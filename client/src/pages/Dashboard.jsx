// import React, { useEffect } from 'react'
// import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import { assets } from '../assets/assets'
// import { useContext } from 'react'
// import { AppContext } from '../context/AppContext'

// const Dashboard = () => {
//   const navigate = useNavigate()

//   const {companyData, setCompanyData, setCompanyToken} =useContext(AppContext)

//   // function   to logout for company 
//   const logout = ()=>{
//     setCompanyToken(null)
//     localStorage.removeItem("companyToken")
//     setCompanyData(null)
//     navigate('/')
//   }

//   useEffect(()=>{

//     if(companyData){
//       navigate('/dashboard/manage-jobs')
//     }
//   }, [companyData])
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar */}
//       <div className="shadow py-4">
//         <div className="px-5 flex justify-between items-center">
//           <img
//             onClick={() => navigate('/')}
//             className="max-sm:w-32 cursor-pointer"
//             src={assets.logo}
//             alt="Logo"
//           />
//                   { companyData  && (

//    <div className="flex items-center gap-3">
    
//             <p className="max-sm:hidden">Welcome, {companyData.name}</p>
//             <div className="relative group">
//               <img
//                 className="w-8 border rounded-full"
//                 src={companyData.image}
//                 alt="Company Icon"
//               />
//               <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
//                 <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm shadow-md">
//                          <li  onClick={logout}className="py-1 px-2 cursor-pointer pr-10 hover:bg-gray-100">
//                     Logout
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//                   )}


       
//         </div>
//       </div>

//       {/* Sidebar + Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div className="w-60 min-h-screen border-r-2">
//           <ul className="flex flex-col pt-5 text-gray-800">
//             <NavLink
//               to="/dashboard/add-job"
//               className={({ isActive }) =>  `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
//                   isActive && 'bg-blue-100 border-r-4 border-blue-500'
//                 }`
//               }
//             >
//               <img  className ='min-w-4'src={assets.add_icon} alt="Add Job" />
//               <p className='max-sm:hidden'>Add Job</p>
//             </NavLink>
//             <NavLink
//               to="/dashboard/manage-jobs"
//               className={({ isActive }) =>
//                 `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
//                   isActive && 'bg-blue-100 border-r-4 border-blue-500'
//                 }`
//               }
//             >
//               <img  className ='min-w-4'src={assets.home_icon} alt="Manage Jobs" />
//               <p className='max-sm:hidden'>Manage Jobs</p>
//             </NavLink>
//      <NavLink
//               to="/dashboard/view-applications"
//               className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${    isActive && 'bg-blue-100 border-r-4 border-blue-500'
//                 }`
//               }
//             >
//               <img className ='min-w-4' src={assets.person_tick_icon} alt="View Applications" />
//               <p className='max-sm:hidden'>View Applications</p>
//             </NavLink>
//           </ul>
//         </div>

//         {/* Main content area */}
//         <div className="flex-1 p-6 h-full sm:p-5">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard



import React, { useEffect, useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, setCompanyData, setCompanyToken } = useContext(AppContext);
  const [refreshJobsFlag, setRefreshJobsFlag] = useState(false);

  // function to logout for company
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem('companyToken');
    setCompanyData(null);
    navigate('/');
  };

  // function to trigger job list refresh
  const triggerJobRefresh = () => {
    setRefreshJobsFlag(prev => !prev); // toggle flag
  };

  useEffect(() => {
    if (companyData) {
      navigate('/dashboard/manage-jobs');
    }
  }, [companyData]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="shadow py-4">
        <div className="px-5 flex justify-between items-center">
          <img
            onClick={() => navigate('/')}
            className="max-sm:w-32 cursor-pointer"
            src={assets.logo}
            alt="Logo"
          />
          {companyData && (
            <div className="flex items-center gap-3">
              <p className="max-sm:hidden">Welcome, {companyData.name}</p>
              <div className="relative group">
                <img
                  className="w-8 border rounded-full"
                  src={companyData.image}
                  alt="Company Icon"
                />
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                  <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm shadow-md">
                    <li
                      onClick={logout}
                      className="py-1 px-2 cursor-pointer pr-10 hover:bg-gray-100"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-60 min-h-screen border-r-2">
          <ul className="flex flex-col pt-5 text-gray-800">
            <NavLink
              to="/dashboard/add-job"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
                  isActive && 'bg-blue-100 border-r-4 border-blue-500'
                }`
              }
            >
              <img className="min-w-4" src={assets.add_icon} alt="Add Job" />
              <p className="max-sm:hidden">Add Job</p>
            </NavLink>
            <NavLink
              to="/dashboard/manage-jobs"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
                  isActive && 'bg-blue-100 border-r-4 border-blue-500'
                }`
              }
            >
              <img className="min-w-4" src={assets.home_icon} alt="Manage Jobs" />
              <p className="max-sm:hidden">Manage Jobs</p>
            </NavLink>
            <NavLink
              to="/dashboard/view-applications"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 hover:bg-gray-100 w-full ${
                  isActive && 'bg-blue-100 border-r-4 border-blue-500'
                }`
              }
            >
              <img className="min-w-4" src={assets.person_tick_icon} alt="View Applications" />
              <p className="max-sm:hidden">View Applications</p>
            </NavLink>
          </ul>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-6 h-full sm:p-5">
          {/* Pass refresh function as context to children */}
          <Outlet context={{ refreshJobsFlag, triggerJobRefresh }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

