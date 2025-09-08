 


import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

/**
  Register a new company
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
  Login company
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
  Get company data
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
  Post a job
 */
export const postJob = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Authenticated company:", req.company);

    if (!req.company) {
      return res.status(401).json({ success: false, message: "Unauthorized. Company not found." });
    }

    const { title, description, salary, location, level, category } = req.body;

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
 Get applicants for company's jobs
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

