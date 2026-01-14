import { Router } from 'express'
import { getMyAnimals, getMyVisitHistory, registerAnimal, transferAnimal } from '../controllers/animal.controller.js'
const router = Router();

router.route('/register').post(registerAnimal);
router.route('/transfer').patch(transferAnimal);
router.route('/my-animals').get(getMyAnimals);
router.route('/my-history').get(getMyVisitHistory);

export default router;