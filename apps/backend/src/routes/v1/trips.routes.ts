import express, { Router } from 'express';
import {
    createTripHandler, getTripHandler, listTripsHandler, updateTripHandler, addDocumentHandler, 
    removeDayHandler, removeDocumentHandler, addPackingItemHandler,togglePackingCheckedHandler, 
    setCollaboratorHandler, addDayHandler, reorderDaysHandler 
} from '../../modules/controllers/trips.controller';

import { requireAuth, authorizeRoles, requireUserOrGuest } from '../../middlewares/auth.middleware';

const router: Router = express.Router();

router.post('/create', requireAuth, createTripHandler);
router.get('/:id/trip', requireAuth, getTripHandler);
router.get('/list', requireAuth, listTripsHandler);
router.put('/:id', requireAuth, updateTripHandler);
router.post('/:id/documents', requireAuth, addDocumentHandler);
router.post('/:id/remove/day', requireAuth, removeDayHandler);
router.delete('/:id/documents/:documentId', requireAuth, removeDocumentHandler);
router.post('/:id/packing-items', requireAuth, addPackingItemHandler);
router.patch('/:id/packing-items/:itemId/toggle', requireAuth, togglePackingCheckedHandler);
router.post('/:id/collaborators', requireAuth, setCollaboratorHandler);
router.post('/:id/days', requireAuth, addDayHandler);
router.patch('/:id/days/reorder', requireAuth, reorderDaysHandler);

export default router;
