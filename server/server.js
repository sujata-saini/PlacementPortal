// import './config/instrument.js'

// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/db.js'
// import * as Sentry from "@sentry/node";


// import clerkWebhooks from './controllers/webhooks.js'
// import companyRoutes from './routes/companyRoutes.js'
// import connectCloudinary from './config/cloudinary.js'
// import jobRoutes from './routes/jobRoutes.js'
// import userRoutes from './routes/userRoutes.js'
// import {clerkMiddleware} from '@clerk/express'

// // initialize express
// const app = express ()

// //connect to db 
// await connectDB ()
// await connectCloudinary()
// // middlewares

// app.use(cors())
// app.use(express.json())
// app.use(clerkMiddleware())


// //routes

// app.get('/', (req, res) => {
//     console.log('GET / request received');
//     res.json({ message: 'API working ✅' });
//     app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// });

// });


// app.post('/api/webhooks',clerkWebhooks)

// app.use('/api/company',companyRoutes)

// app.use ('/api/jobs',jobRoutes)
// app.use('/api/users', userRoutes)
// //port
// const PORT =process.env.PORT || 8080

// Sentry.setupExpressErrorHandler(app);

// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`)
// })


import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";

import clerkWebhooks from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import cloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

// -------------------- Initialize Express --------------------
const app = express();

// -------------------- Connect to DB --------------------
await connectDB();
console.log("Database connected ✅");

// -------------------- Cloudinary --------------------
console.log("Cloudinary connected ✅");

// -------------------- Initialize Sentry --------------------
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// -------------------- Middlewares --------------------
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// -------------------- Routes --------------------
app.get('/', (req, res) => {
  console.log('GET / request received');
  res.json({ message: 'API working ✅' });
});

app.get("/debug-sentry", (req, res) => {
  try {
    throw new Error("My first Sentry error!");
  } catch (err) {
    Sentry.captureException(err); // manually capture error
    res.status(500).json({ message: "Sentry error captured" });
  }
});

app.post('/api/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// -------------------- Global Error Handler --------------------
app.use((err, req, res, next) => {
  Sentry.captureException(err); // capture all unhandled errors
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
