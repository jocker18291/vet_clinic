import { Router } from 'express'
import { registerAnimal } from '../controllers/animal.controller.js'
const router = Router();

router.route('/register').post(registerAnimal);

export default router;