import { Router } from 'express'
import { registerVisit, deleteVisit } from '../controllers/visit.controller.js';
const router = Router();

router.route('/register').post(registerVisit);
router.route('/cancel/:visitId').patch(deleteVisit);

export default router;