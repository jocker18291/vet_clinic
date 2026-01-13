import { Router } from 'express'
import { registerVet } from '../controllers/vet.controller.js';
const router = Router();

router.route('/register').post(registerVet);

export default router;