// import mongoose from "mongoose";

// const jobSchema  =new mongoose.Schema({

//     title :{type:String,required:true},
//     description: {type:String,required:true},
//     location: {type:String,required:true},
//   category: {type:String,required:true},
//       level: {type:String,required:true},
//           salary: {type:String,required:true},
//               date: {type:Number,required:true},
//             visible: {type:Boolean, default:true},
//             companyId :{type:mongoose.Schema.Types.ObjectId,ref:'company', required:true}
// })

// const Job =mongoose.model('Job',jobSchema)
// export default Job

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  salary: { type: String, required: true },
  date: { type: Number, required: true },
  visible: { type: Boolean, default: true },

  // ❌ old: ref:'company'
  // ✅ fixed: must match model name "Company"
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
