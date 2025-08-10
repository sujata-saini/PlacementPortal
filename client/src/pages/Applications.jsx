 

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import { jobsApplied } from '../assets/assets'
import Footer from '../components/Footer'
import moment from 'moment'

const Applications = () => {

  const [isEdit,setIsEdit]=useState(false)
  const[resume,setResume]=useState(null)
  return (
   <>
   <Navbar/>
   
   <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
    <h2 className='text-xl font-semibold'>Your Resume</h2>
    <div className='flex gap-2 mb-6 mt-3'>
      {
        isEdit ? 
        <>
        <label className='flex items-center' htmlFor='resumeUpload'>
          <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>Select Resume</p>
          <input  id= 'resumeUpload' onChange={e=>setResume(e.target.files[0])}accept='application/pdf'type='file'hidden/>
          <img src={assets.profile_upload_icon} alt=""/>
        </label>
        <button  onClick={e=>setIsEdit(false)}className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
         
           {/* to see resume upload */}
          {resume && (
            <div>
                <p className=" text-sm text-gray-600 italic">
                  Selected: {resume.name}
                </p>
                </div>
              )}
            
        </> :<div className='flex gap-2' >
            <a  className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'href=''>Resume</a>
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
      {jobsApplied.map((job, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="px-6 py-4 flex items-center gap-2">
            <img src={job.logo} alt={job.company} className="w-6 h-6 rounded-full" />
            {job.company}
          </td>
          <td className="px-6 py-4">{job.title}</td>
          <td className="px-6 py-4">{job.location}</td>
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
