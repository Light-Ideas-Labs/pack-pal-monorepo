import express, { Router } from 'express';
import { getTravelRequirements } from '../../modules/controllers/travel.requirements.controllers';

const router: Router = express.Router();

router.get('/travel-requirements', getTravelRequirements);

export default router;