import { Router } from 'express'
import { assignVet, getMyAnimals, getMyVisitHistory, registerAnimal, transferAnimal } from '../controllers/animal.controller.js'
const router = Router();

router.route('/register').post(registerAnimal);
router.route('/transfer').patch(transferAnimal);
router.route('/my-animals').get(getMyAnimals);
router.route('/my-history').get(getMyVisitHistory);
router.route('/assign-vet').patch(assignVet);

export default router;