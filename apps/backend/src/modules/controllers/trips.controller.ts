import asyncHandler from "express-async-handler";
import { RequestHandler, Request, Response } from 'express';
import { createTrip, getTrip, listTripsByOwner, updateTrip, addDocument, removeDocument, addPackingItem, togglePackingChecked, setCollaborator, addDay, reorderDays, removeDay } from '../services/trips.service';
import { parsePageParams } from "../../utils/pagination";

// add these helpers near the top of the controller
const toBoolean = (v: unknown): boolean => {
  if (v == null) return false;
  const s = String(v).toLowerCase();
  return s === "true" || s === "1" || s === "yes";
};

const parseSort = (raw: unknown): Record<string, 1 | -1> => {
  if (!raw) return { updatedAt: -1 };
  const s = String(raw);
  // supports "field:asc" or "field:desc"
  const [field, dir] = s.split(":");
  return { [field || "updatedAt"]: dir === "asc" ? 1 : -1 };
};

// Create a new trip
const createTripHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { title, destination, startDate, endDate } = req.body;
    const ownerId = req.user?.id;
    if (!ownerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if (!title || !startDate || !endDate) {
        res.status(400).json({ success: false, message: 'Title, startDate, and endDate are required' });
        return;
    }
    const trip = await createTrip({ title, startDate, endDate, ownerId });
    res.status(201).json({ success: true, data: trip });
});

// Get a trip by ID
const getTripHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const trip = await getTrip(tripId);
    if (!trip) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
    }
    res.status(200).json({ success: true, data: trip });
});

// List trips for the authenticated user
const listTripsHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user?.id;
    if (!ownerId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    const { page, limit } = parsePageParams(req.query, { page: 1, limit: 20 });
    const trips = await listTripsByOwner(ownerId, { page, limit });
    res.status(200).json({ success: true, data: trips });
});

// Update a trip
const updateTripHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const updates = req.body;
    const trip = await updateTrip(tripId, updates);
    if (!trip) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
    }
    res.status(200).json({ success: true, data: trip });
});

// Add a document to a trip
const addDocumentHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const { name, url, size, mimeType } = req.body;
    if (!name || !url) {
        res.status(400).json({ success: false, message: 'Name and URL are required' });
        return;
    }
    const document = await addDocument(tripId, { name, url, size, mimeType });
    if (!document) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
    }
    res.status(201).json({ success: true, data: document });
});

// Remove a document from a trip
const removeDocumentHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const documentId = req.params.documentId;
    if (!documentId) {
        res.status(400).json({ success: false, message: 'Document ID is required' });
        return;
    }
    const success = await removeDocument(tripId, documentId);
    if (!success) {
        res.status(404).json({ success: false, message: 'Trip or document not found' });
        return;
    }
    res.status(204).send();
});

// Add a packing item to a trip
const addPackingItemHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const { name, quantity, category } = req.body;
    if (!name) {
        res.status(400).json({ success: false, message: 'Name is required' });
        return;
    }
    const item = await addPackingItem(tripId, { name, quantity, category });
    if (!item) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
    }
    res.status(201).json({ success: true, data: item });
});

// Toggle packing item checked status
const togglePackingCheckedHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const itemId = req.params.itemId;
    if (!itemId) {
        res.status(400).json({ success: false, message: 'Item ID is required' });
        return;
    }

    const checked = toBoolean(req.body.checked);
    const item = await togglePackingChecked(tripId, itemId, checked);
    if (!item) {
        res.status(404).json({ success: false, message: 'Trip or item not found' });
        return;
    }
    res.status(200).json({ success: true, data: item });
});

// Set a collaborator on a trip
const setCollaboratorHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const { userId, role, status } = req.body;
    if (!userId || !role) {
        res.status(400).json({ success: false, message: 'User ID and role are required' });
        return;
    }
    
    const collaborator = await setCollaborator(tripId, userId, role, status ?? 'pending');
    if (!collaborator) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
    }
    res.status(200).json({ success: true, data: collaborator });
});

// Add a day to the trip
const addDayHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const { date, activities } = req.body;
    if (!date) {
        res.status(400).json({ success: false, message: 'Date is required' });
        return;
    }
    const day = await addDay(tripId, { date, activities });
    if (!day) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
    }
    res.status(201).json({ success: true, data: day });
});

// Reorder days in the trip
const reorderDaysHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const { dayOrder } = req.body;
    if (!Array.isArray(dayOrder)) {
        res.status(400).json({ success: false, message: 'dayOrder must be an array of day IDs' });
        return;
    }
    const success = await reorderDays(tripId, dayOrder);
    if (!success) {
        res.status(404).json({ success: false, message: 'Trip not found' });
        return;
    }
    res.status(200).json({ success: true });
});

// Remove a day from the trip
const removeDayHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const tripId = req.params.id;
    const dayId = req.params.dayId;
    if (!dayId) {
        res.status(400).json({ success: false, message: 'Day ID is required' });
        return;
    }
    const success = await removeDay(tripId, dayId);
    if (!success) {
        res.status(404).json({ success: false, message: 'Trip or day not found' });
        return;
    }
    res.status(204).send();
});

export {
    createTripHandler,
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
    reorderDaysHandler
};