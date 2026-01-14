import { Router } from 'express'
import { registerVisit, deleteVisit, completeVisit, getMonthlyStats, getVetVisits } from '../controllers/visit.controller.js';
const router = Router();

router.route('/register').post(registerVisit);
router.route('/cancel/:visitId').patch(deleteVisit);
router.route('/complete/:visitID').patch(completeVisit);
router.route('/stats/monthly').get(getMonthlyStats);
router.route('/vet/:vetId').get(getVetVisits);

export default router;