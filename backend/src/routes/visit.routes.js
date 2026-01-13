import { Router } from 'express'
import { registerVisit } from '../controllers/visit.controller.js';
const router = Router();

router.route('/register').post(registerVisit);

export default router;