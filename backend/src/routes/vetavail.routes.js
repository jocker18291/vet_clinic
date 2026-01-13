import { Router } from 'express'
import { setupWorkDay } from '../controllers/vetavail.controller.js';
const router = Router();

router.route('/availability').post(setupWorkDay);

export default router;