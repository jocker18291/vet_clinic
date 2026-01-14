import { Router } from 'express'
import { getAvailableSlots, setupWorkDay } from '../controllers/vetavail.controller.js';
const router = Router();

router.route('/availability').post(setupWorkDay);
router.route('/free/:vet/:date').get(getAvailableSlots);

export default router;