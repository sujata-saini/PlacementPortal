

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import Loading from '../components/Loading';

const ManagesJobs = () => {
  const navigate = useNavigate();
  const { backendUrl, companyToken } = useContext(AppContext);
  const [jobs, setJobs] = useState(null); // null while loading

  // fetch jobs
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });

      if (data.success) setJobs(data.jobs.reverse());
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // change job visibility
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (companyToken) fetchCompanyJobs();
  }, [companyToken]);

  return jobs === null ? (
    <Loading />
  ) : jobs.length === 0 ? (
    <div className="flex items-center justify-center h-[70vh]">
      <p className="text-xl sm:text-2xl">No jobs Available or posted</p>
    </div>
  ) : (
    <div className="p-4">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-gray-600">#</th>
            <th className="p-3 text-left text-gray-600">Job Title</th>
            <th className="p-3 text-left text-gray-600">Date</th>
            <th className="p-3 text-left text-gray-600">Location</th>
            <th className="p-3 text-left text-gray-600">Applicants</th>
            <th className="p-3 text-left text-gray-600">Visible</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={job._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
              <td className="p-3">{index + 1}</td>
              <td className="p-3 text-gray-800">{job.title}</td>
              <td className="p-3 text-gray-700">{moment(job.date).format('DD MMM, YYYY')}</td>
              <td className="p-3 text-gray-700">{job.location}</td>
              <td className="p-3 text-gray-700">{job.applicants}</td>
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={job.visible}
                  onChange={() => changeJobVisibility(job._id)}
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          Add new job
        </button>
      </div>
    </div>
  );
};

export default ManagesJobs;

