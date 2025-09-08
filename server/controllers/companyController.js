// import Company from "../models/Company.js";
// import bcrypt from 'bcrypt'
// import {v2 as cloudinary} from 'cloudinary'
// import generateToken from "../utils/generateToken.js";
// import Job from "../models/Job.js";
// import jobApplication from "../models/jobApplication.js";
// // register a new company 

// export const registerCompany = async (req,res)=>{

// const {name,email,password}=req.body;
// const imageFile =req.file;
// if(!name || !email || !password || !imageFile){

//     return res.json({success:false,message: "Missing Details"})


// }
// try{
// const companyExists =await Company.findOne({email})

// if (companyExists){
//     return res.json({success: false ,message:'Company already  registered'})
// }
// const salt= await bcrypt.genSalt(10) 
// const haspassword =await bcrypt.hash(password,salt)

// const imageUpload = await cloudinary.uploader.upload(imageFile.path)
// const company= await Company.create({
// name,
// email,
//  password:haspassword,
//  image :imageUpload.secure_url

// })

// res.json({
//     success:true,
//     company:{
//         _id:company._id,
//         name : company.name,
//         email: company.email,
//         image : company.image
//     }, 
// // send token for authentication 
// // in utils file 

// token: generateToken(company._id)

// })


// }
// catch(error){

//     res.json({success:false, message:error.message})
// }

// }
// //company login

// export const loginCompany =async (req,res)=>{
//     const {email, password}=req.body 
//     try{
//         const company=await Company.findOne({email})
//         if ( await bcrypt.compare(password,company.password)){

//             res.json({
//                 success:true, 
//                 company:{
//  _id:company._id,
//         name : company.name,
//         email: company.email,
//         image : company.image
//                 },
//                 token:generateToken(company._id)
//             })
//         }
//         else{
//             res.json({success:false,message:"Invalid email or password"})
//         }
//     }
//     catch(error){
// res.json ({success:false,message:error.message})
//     }


// }
// // get company data  
// export const getCompanyData=async(req,res)=>{
// const company=req.company

// try{

//     res.json ({success:true,company})
// }
// catch(error){
//     res.json({success:false,message:error.message})
// }

// }

// // post a new job

// export const postJob = async (req,res)=>{
// const {title, description,location,salary,level,category}= req.body

// const companyId = req.company._id
// // 

// try{
//     const newJob  =new Job({
//         title,
//         description,location
//         ,salary,
//     companyId,
//         date:Date.now(),
//         level,
//         category
//     }
//     )

// await newJob.save()
// res.json ({success:true , newJob})

// }
// catch(error){
//     res.json({success:false,message:error.message})
// }
// }

// // get company  job applicants

// export const getCompanyJobApplicants =async (req,res)=>{

//     try{

//         const companyId = req.company._id

//         // find job applications for user and populate related data 

//         const applications = await JobApplication.find({companyId})
//         .populate('userId', 'name image resume')
//         .populate('jobId', 'title location category level salary')
//         .exec()

//         return res.json({success:true, applications})
//     }
//     catch(error){

//         res.json({success:false, message:error.message})
//     }
// }

// // get company posted jobs 

// export const getCompanyPostedJobs =async (req,res)=>{

//     try{

//         const companyId =req.company._id
//         const jobs =await Job.find({companyId})

//         // adding no of appicants info 

//         const jobsData = await Promise.all(jobs.map(async (job)=>{
// const  applicants = await JobApplication.find({jobId : job._id});

// return {...job.toObject(),applicants:applicants.length}

//         }))
//         res.json({success:true, jobsData})
//     }
//     catch(error){
// res.json({success:false,message:error.message})
//     }

// }

// // change job applicsn status 

// export const changeJobApplicationsStatus =async(req,res)=>{

//     try{

//             const {id ,status }= req.body 

//     // find job applicsn and update status 

//     await JobApplication.findOneAndUpdate({_id: id}, {status})

//     res.json ({success:true ,message:"Status changed"})


//     }

//     catch(error){

//         res.json({success:false,message:error.message})

//     }


// }

// // change job visibility 
// export const changeVisibility =async(req,res)=>{
// try{
// const {id }=req.body

// const companyId= req.company._id
// const job =await Job.findById(id)

// if (companyId.toString() === job.companyId.toString()){
//     job.visible = !job.visible
// }
// await job.save()
// res.json({success:true,job})
// }
// catch(error){
// res.json({success:false,message:error.message})
// }


// }

// import Company from "../models/Company.js";
// import bcrypt from "bcrypt";
// import { v2 as cloudinary } from "cloudinary";
// import generateToken from "../utils/generateToken.js";
// import Job from "../models/Job.js";
// import JobApplication from "../models/jobApplication.js"; 


import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

/**
 * 📌 Register a new company
 */
export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Optional logo upload
    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "companies" }, (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          })
          .end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const company = new Company({
      name,
      email,
      password,
      image: imageUrl,
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 📌 Login company
 */
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const company = await Company.findOne({ email });
    if (!company) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("Error in loginCompany:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

/**
 * 📌 Get company data
 */
export const getCompanyData = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select("-password");
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, company });
  } catch (error) {
    console.error("Error in getCompanyData:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

/**
 * 📌 Post a job
 */
// 📌 Post a new job with full validation and debug logs
export const postJob = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Authenticated company:", req.company);

    // ✅ Check if company is attached by auth middleware
    if (!req.company) {
      return res.status(401).json({ success: false, message: "Unauthorized. Company not found." });
    }

    const { title, description, salary, location, level, category } = req.body;

    // ✅ Validate required fields
    if (!title || !description || !salary) {
      return res.status(400).json({ success: false, message: "Title, description, and salary are required" });
    }

    // Create the job
    const newJob = new Job({
      companyId: req.company._id,
      title,
      description,
      salary,
      location: location || "",
      level: level || "",
      category: category || "",
      date: Date.now(),
      visible: true, // optional default
    });

    await newJob.save();

    console.log("Job created successfully:", newJob);

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    console.error("Error in postJob route:", error);

    // Return Mongoose validation errors if any
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};


/**
 * 📌 Get applicants for company's jobs
 */
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.company._id });
    if (!jobs.length) return res.status(404).json({ success: false, message: "No jobs found for this company" });

    const jobIds = jobs.map((job) => job._id);
    const applicants = await JobApplication.find({ job: { $in: jobIds } })
      .populate("user", "name email")
      .populate("job", "title");

    res.json({ success: true, applicants });
  } catch (error) {
    console.error("Error in getCompanyJobApplicants:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// /**
//  * 📌 Get list of jobs posted by company
//  */
// export const getCompanyPostedJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({ company: req.company._id });
//     res.json({ success: true, jobs });
//   } catch (error) {
//     console.error("Error in getCompanyPostedJobs:", error);
//     res.status(500).json({ success: false, message: "Server error. Please try again later." });
//   }
// };

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.company._id }).sort({ date: -1 });

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantsCount = await JobApplication.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicants: applicantsCount };
      })
    );

    res.json({ success: true, jobs: jobsWithApplicants });
  } catch (error) {
    console.error("Error in getCompanyPostedJobs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

