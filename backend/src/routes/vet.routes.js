import { Router } from 'express'
import { registerVet, loginVet, logoutVet, getAllVets } from '../controllers/vet.controller.js';
const router = Router();

router.route('/register').post(registerVet);
router.route('/login').post(loginVet);
router.route('/logout').post(logoutVet);
router.route('/vetList').get(getAllVets);

export default router;
