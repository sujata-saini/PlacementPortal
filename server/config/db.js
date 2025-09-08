import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use the URI directly from .env
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Optional: default write concern
      // writeConcern: { w: "majority" } 
    });

    console.log("Database connected ✅");

    // Optional: Log connection events
    mongoose.connection.on("error", (err) => console.log("DB Connection Error:", err));
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Stop server if DB connection fails
  }
};

export default connectDB;
