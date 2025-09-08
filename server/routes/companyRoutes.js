// import express from 'express'
// import { changeVisibility, loginCompany, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, postJob, registerCompany } from '../controllers/companyController.js'
// import { protectCompany } from '../middleware/authMiddleware.js'
// import upload from '../config/multer.js'
// const router =express.Router()

// //register a company 
// router.post('/register',upload.single('image'),registerCompany)

// //company login 
// router.post('/login',loginCompany)

// //get company data 
// router.get('/company',protectCompany,getCompanyData)

// // post a job
// router.post('/post-job',protectCompany,postJob)

// //get applicants data of company 
// router.get('/applicants',protectCompany, getCompanyJobApplicants)

// // get company job list 
// router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

// //change applisn status 

// router.post ('/change-status',protectCompany, changeJobApplicationsStatus)

// // change applicsn visibility
// router.post('/change-visibiliy',protectCompany, changeVisibility)

// export default router


import express from "express";

import {
  registerCompany,
  loginCompany,          // ✅ must exist in companyController.js
  getCompanyData,       // ✅ already added
  postJob,              // ✅ must exist in companyController.js
  getCompanyJobApplicants, // ✅ must exist in companyController.js
  getCompanyPostedJobs,    // ✅ must exist in companyController.js
} from "../controllers/companyController.js";

import { protectCompany } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// 📌 Register a company
router.post("/register", upload.single("image"), registerCompany);

// 📌 Company login
router.post("/login", loginCompany);

// 📌 Get company profile/data
router.get("/company", protectCompany, getCompanyData);

// 📌 Post a job
router.post("/post-job", protectCompany, postJob);
// router.post("/post-job",  postJob);


// 📌 Get applicants data of company
router.get("/applicants", protectCompany, getCompanyJobApplicants);

// 📌 Get list of jobs posted by company
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

export default router;










