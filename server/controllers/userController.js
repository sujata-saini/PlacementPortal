// import JobApplication from "../models/jobApplication.js"
// import User from "../models/User.js"
// import Job from "../models/Job.js"
// import { v2 as cloudinary } from "cloudinary"

// // get user data 
// export const getUserData = async (req, res) => {
//   const userId = req.auth.userId
//   try {
//     const user = await User.findById(userId)
//     if (!user) {
//       return res.json({ success: false, message: "User Not Found" })
//     }
//     res.json({ success: true, user })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// // apply for a job 
// export const applyForJob = async (req, res) => {
//   const { jobId } = req.body
//   const userId = req.auth.userId
//   try {
//     const isAlreadyApplied = await JobApplication.find({ jobId, userId })
//     if (isAlreadyApplied.length > 0) {
//       return res.json({ success: false, message: "Already Applied" })
//     }

//     const jobData = await Job.findById(jobId)
//     if (!jobData) {
//       return res.json({ success: false, message: "Job not found" })
//     }

//     await JobApplication.create({
//       companyId: jobData.companyId,
//       userId,
//       jobId,
//       date: Date.now(),
//     })

//     res.json({ success: true, message: "Applied Successfully" })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// // get user applied applications 
// export const getUserJobApplications = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const applications = await JobApplication.find({ userId })
//       .populate("companyId", "name email image")
//       .populate("jobId", "title description location category level salary")

//     if (!applications || applications.length === 0) {
//       return res.json({ success: false, message: "No Job Applications found for this user" })
//     }

//     return res.json({ success: true, applications })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

// // update user profile (resume)
// export const updateUserResume = async (req, res) => {
//   try {
//     const userId = req.auth.userId
//     const resumeFile = req.file
//     const userData = await User.findById(userId)

//     if (resumeFile) {
//       const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
//       userData.resume = resumeUpload.secure_url
//     }

//     await userData.save()
//     return res.json({ success: true, message: "Resume Updated" })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }




import JobApplication from "../models/jobApplication.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { v2 as cloudinary } from "cloudinary";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// apply for a job 
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    const existingApplication = await JobApplication.findOne({
      job: jobId,
      user: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      company: jobData.company, // ✅ should match JobApplication schema
      user: req.user._id,
      job: jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied successfully" });
  } catch (error) {
    console.error("Error in applyForJob:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.user._id })
      .populate("company", "name email image") // make sure field names match schema
      .populate("job", "title description location category level salary");

    if (!applications || applications.length === 0) {
      return res.status(404).json({ success: false, message: "No job applications found" });
    }

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user resume
export const updateUserResume = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.file) {
      const resumeUpload = await cloudinary.uploader.upload(req.file.path); // or req.file.buffer if memoryStorage
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();
    res.json({ success: true, message: "Resume updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
