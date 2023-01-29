import express from 'express';
import jobController from '../controllers/jobController.js'
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', jobController.createJob);
router.get('/', jobController.getAllJobs);

router.get('/stats', jobController.showStats);
router.delete('/:id', jobController.deleteJob);
router.patch('/:id', jobController.updateJob);
router.post('/search', jobController.searchJob)


export default router;
