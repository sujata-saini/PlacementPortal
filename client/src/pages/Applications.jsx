 

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import { jobsApplied } from '../assets/assets'
import Footer from '../components/Footer'
import moment from 'moment'
import { AppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'
import { toast } from 'react-toastify'

const Applications = () => {


  const {user}= useUser()
  const {getToken}= useAuth()
  const [isEdit,setIsEdit]=useState(false)
  const[resume,setResume]=useState(null)

  const {backendUrl, userData, userApplications, fetchUserData, fetchUserApplications} = userContext(AppContext)

  const updateResume = async ()=> {

    try{

      const formData = new FormData()
 formData.append('resume', resume )
 const token = awaitgetToken()
 
 const {data } = await axios.post(backendUrl + '/api/users/update-resume', 
  formData,
  {headers: {Authorization : `Bearer ${token}`}}
 )

 
 if (data.success){

  toast.success(data.message)
  await fetchUserData()
 }
 else {

  toast.error(data.message)
 }
 
    }
    catch(error){
toast.error(error.message)

    }


    setIsEdit(false)
    setResume(null)
  }

  useEffect(()=>{

    if(user){
      fetchUserApplications
    }

  }, [user])
  return (
   <>
   <Navbar/>
   
   <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
    <h2 className='text-xl font-semibold'>Your Resume</h2>
    <div className='flex gap-2 mb-6 mt-3'>
      {
        isEdit || userData &&  userData.resume === ""
        ?
        <>
        <label className='flex items-center' htmlFor='resumeUpload'>
          <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>{resume ? resume.name : "Select resume "}</p>
          <input  id= 'resumeUpload' onChange={e=>setResume(e.target.files[0])}accept='application/pdf'type='file'hidden/>
          <img src={assets.profile_upload_icon} alt=""/>
        </label>
        <button  onClick={updateResume}className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
         
           {/* to see resume upload */}
          {resume && (
            <div>
                <p className=" text-sm text-gray-600 italic">
                  Selected: {resume.name}
                </p>
                </div>
              )}
            
        </> :<div className='flex gap-2' >
            <a   target='_blank' className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'href={userData.resume}>Resume</a>
        <button onClick={()=>setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>Edit</button></div>
      }
    </div>
    <h2 className="text-lg font-semibold mb-3">Jobs Applied</h2>
<div className="overflow-x-auto border border-gray-200 rounded-lg">
  <table className="w-full text-sm text-left">
    <thead className="bg-gray-50 text-gray-600">
      <tr>
        <th className="px-6 py-3 font-medium">Company</th>
        <th className="px-6 py-3 font-medium">Job Title</th>
        <th className="px-6 py-3 font-medium">Location</th>
        <th className="px-6 py-3 font-medium">Date</th>
        <th className="px-6 py-3 font-medium">Status</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {userApplications.map((job, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="px-6 py-4 flex items-center gap-2">
            <img src={job.companyId.image} alt={job.companyId.name} className="w-6 h-6 rounded-full" />
            {job.company}
          </td>
          <td className="px-6 py-4">{job.jobId.title}</td>
          <td className="px-6 py-4">{job.jobId.location}</td>
          <td className="px-6 py-4">{moment(job.date).format('DD MMM, YYYY')}</td>
          <td className="px-6 py-4">
            <span
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                job.status === 'Pending'
                  ? 'bg-blue-100 text-blue-600'
                  : job.status === 'Accepted'
                  ? 'bg-green-100 text-green-600'
                  : job.status === 'Rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {job.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

   </div>
   <Footer/>
   </>
  
  )
}
export default Applications
