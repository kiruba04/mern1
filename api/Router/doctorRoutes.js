import express from 'express';
import { addDoctor,noofcategory,getdoctor,getdoctors,updatedoctor } from '../controller/doctorController.js';
import authenticateAdmin from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/add-doctor', authenticateAdmin, addDoctor);
router.get("/category",noofcategory)
router.get("/info/:id",getdoctor)
router.get("/getdoctor",getdoctors)
router.put('/update-doctor/:id',updatedoctor);

export default router;
