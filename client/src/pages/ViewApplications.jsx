
import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
// import Loading from '../components/Loading' // 👈 if you have a Loading component

const ViewApplications = () => {
  const { backenUrl, companyToken } = useContext(AppContext)

  const [applicants, setApplicants] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)

  // function to fetch company job applications data
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(backenUrl + '/api/company/applicants', {
        headers: { token: companyToken },
      })

      if (data.success) {
        setApplicants(data.applications.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // function to update job applications status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backenUrl + '/api/company/change-status',
        { id, status },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        fetchCompanyJobApplications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }
  }, [companyToken])

  return applicants ? (
    applicants.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">No Applications available</p>
      </div>
    ) : (
      <div className="p-4">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-gray-600">#</th>
              <th className="p-3 text-left text-gray-600">User name</th>
              <th className="p-3 text-left text-gray-600">Job Title</th>
              <th className="p-3 text-left text-gray-600">Location</th>
              <th className="p-3 text-left text-gray-600">Resume</th>
              <th className="p-3 text-left text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants
              .filter((item) => item.jobId && item.userId)
              .map((applicant, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={applicant.userId.image}
                      alt={applicant.userId.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-800">
                      {applicant.userId.name}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{applicant.jobId.title}</td>
                  <td className="p-3 text-gray-700">
                    {applicant.jobId.location}
                  </td>
                  <td className="p-3">
                    <a
                      href={applicant.userId.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    >
                      Resume
                      <img
                        src={assets.resume_download_icon}
                        alt="download"
                        className="w-4 h-4"
                      />
                    </a>
                  </td>
                  <td className="p-3 relative">
                    {applicant.status === 'pending' ? (
                      <>
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === index ? null : index)
                          }
                          className="p-1 rounded hover:bg-gray-200"
                        >
                          ...
                        </button>

                        {openMenu === index && (
                          <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-10">
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  'accepted'
                                )
                              }
                              className="w-full text-left px-3 py-2 text-green-600 hover:bg-green-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  'rejected'
                                )
                              }
                              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div>{applicant.status}</div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  ) : (
    // 👇 fallback if Loading component is missing
    <p className="text-center p-6">Loading...</p>
  )
}

export default ViewApplications

