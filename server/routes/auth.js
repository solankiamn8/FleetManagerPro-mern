import { Router } from 'express';
import { register, login, me, requestPasswordReset, resetPassword, verifyOTP} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.post('/password/reset-request', requestPasswordReset);
router.post('/password/reset', resetPassword);
router.post("/email-verify", verifyOTP);


export default router;
