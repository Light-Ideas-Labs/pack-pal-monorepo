import express, { Router } from 'express';
import {     createTripHandler,
    getTripHandler,
    listTripsHandler,
    updateTripHandler,
    addDocumentHandler,
    removeDayHandler,
    removeDocumentHandler,
    addPackingItemHandler,
    togglePackingCheckedHandler,
    setCollaboratorHandler,
    addDayHandler,
    reorderDaysHandler } from '../../modules/controllers/trips.controller';

const router: Router = express.Router();

router.post('/', createTripHandler);
router.get('/:id', getTripHandler);
router.get('/', listTripsHandler);
router.put('/:id', updateTripHandler);
router.post('/:id/documents', addDocumentHandler);
router.post('/:id/remove/day', removeDayHandler);
router.delete('/:id/documents/:documentId', removeDocumentHandler);
router.post('/:id/packing-items', addPackingItemHandler);
router.patch('/:id/packing-items/:itemId/toggle', togglePackingCheckedHandler);
router.post('/:id/collaborators', setCollaboratorHandler);
router.post('/:id/days', addDayHandler);
router.patch('/:id/days/reorder', reorderDaysHandler);

export default router;
