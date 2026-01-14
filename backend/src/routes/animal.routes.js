import { Router } from 'express'
import { registerAnimal, transferAnimal } from '../controllers/animal.controller.js'
const router = Router();

router.route('/register').post(registerAnimal);
router.route('/transfer').patch(transferAnimal);

export default router;