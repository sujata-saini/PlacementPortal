import express from 'express'
import { getJobs, getJobById } from '../controllers/jobController.js';

const router = express.Router()

// route to get all jobs data
router.get('/', getJobs )



// route to get a single job by id 

router.get('/:id',getJobById)
export default router;