
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import kconvert from "k-convert";
import moment from "moment";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";

const ApplyJob = () => {
  const { id } = useParams();
  const [JobData, setJobData] = useState(null);

  const { jobs } = useContext(AppContext);

  const fetchJob = async () => {
    const data = jobs.filter((job) => job._id === id);
    if (data.length !== 0) {
      setJobData(data[0]);
    }
  };

  useEffect(() => {
    if (jobs.length > 0) {
      fetchJob();
    }
  }, [id, jobs]);

  return JobData ? (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Job Header Card */}
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 h-48">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
              <img
                src={JobData.companyId.image}
                alt={JobData.companyId.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{JobData.title}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <img src={assets.suitcase_icon} alt="" className="w-4 h-4" />
                  {JobData.companyId.name}
                </span>
                <span className="flex items-center gap-1">
                  <img src={assets.location_icon} alt="" className="w-4 h-4" />
                  {JobData.location}
                </span>
                <span className="flex items-center gap-1">
                  <img src={assets.person_icon} alt="" className="w-4 h-4" />
                  {JobData.level}
                </span>
                <span className="flex items-center gap-1">
                  <img src={assets.money_icon} alt="" className="w-4 h-4" />
                  CTC: {kconvert.convertTo(JobData.salary)}
                </span>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium">
              Apply now
            </button>
            <p className="text-gray-500 text-xs">
              Posted {moment(JobData.date).fromNow()}
            </p>
          </div>
        </div>
        
       {/* Outer container */}
<div className="flex flex-col lg:flex-row gap-8 mt-8">
  
  {/* Left Section (Job Description) */}
<div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 min-h-screen">
  <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
    Job Description
  </h2>
  
  <div
    className="prose max-w-none mb-10 text-gray-700 leading-relaxed"
    dangerouslySetInnerHTML={{ __html: JobData.description }}
  />
  
  <button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 transition-all duration-200 text-white px-10 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-xl">
    Apply Now
  </button>
</div>



  {/* Right Section (Sidebar) */}
  <div className="w-full lg:w-80 bg-white p-5 rounded-lg shadow-lg border border-gray-200">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      More Jobs from {JobData.companyId.name}
    </h2>
    
    <div className="space-y-4">
      {jobs
        .filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
        .slice(0, 4)
        .map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
    </div>
  </div>

</div>

</div>
      <Footer/>         
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
