// import mongoose from "mongoose";
// const userSchema =new mongoose.Schema({
//     _id:  {type:String,required :true},
//     name:{type:String,required :true},
//     email: {type:String,required:true,unique :true},
//     resume:{type:String},
//     image:{type:String, required:true}

// })

// const User= mongoose.model('User ', userSchema)
// export default User;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk's user ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resume: { type: String, default: "" },
  image: { type: String },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
