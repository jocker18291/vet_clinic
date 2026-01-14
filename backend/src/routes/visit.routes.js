import { Router } from 'express'
import { registerVisit, deleteVisit, completeVisit } from '../controllers/visit.controller.js';
const router = Router();

router.route('/register').post(registerVisit);
router.route('/cancel/:visitId').patch(deleteVisit);
router.route('/complete/:visitID').patch(completeVisit)

export default router;