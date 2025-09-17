import asyncHandler from "express-async-handler";
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { paginateArray, parsePageParams, buildMeta } from "../../utils/pagination";
import { addToWatchlist, removeFromWatchlistByTarget, removeFromWatchlistById, getUserWatchlist, getWatchlistItem, updateWatchlistItem,
  muteWatchlistItem, updateNotifyRules, addLabels, removeLabel, findCountryWatchers, findTripReminderWatchers } from '../services/watchlists.service';

  // Allowed kinds (mirror your model)
const WATCH_KINDS = ['Project', 'Trips', 'Places', 'Flights', 'Countries'] as const;
type WatchTargetKind = typeof WATCH_KINDS[number];

function isWatchTargetKind(v: unknown): v is WatchTargetKind {
  return typeof v === 'string' && (WATCH_KINDS as readonly string[]).includes(v as any);
}


// Add item to watchlist
const addWatchlistItem: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ 
      success : false,
      message: 'Unauthorized'
     });
    return;
  }

  const { targetId } = req.body;
  if (!targetId) {
    res.status(400).json({ 
      success: false,
      message: 'Target ID is required' 
    });
    return;
  }

  const result = await addToWatchlist(userId, targetId);
  if (!result) {
    res.status(404).json({ 
      success: false,
      message: 'Item not found' 
    });
    return;
  }

  res.status(201).json({ 
    success: true,
    message: 'Item added to watchlist', 
    dataItem: result 
  });
  } catch (error) {
    console.log("Error adding to watchlist:", error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Remove item from watchlist by target ID
const removeWatchlistItemByTarget: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ 
      success : false,
      message: 'Unauthorized'
     });
    return;
  }

  const { targetId } = req.body;
  if (!targetId) {
    res.status(400).json({
      success: false,
      message: 'Target ID is required'
    });
    return;
  }
  const result = await removeFromWatchlistByTarget(userId, targetId);
  if (!result) {
    res.status(404).json({ 
      success: false,
      message: 'Item not found in watchlist' 
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Item removed from watchlist',
    dataItem: result
  });
  } catch (error) {
    console.log("Error removing from watchlist:", error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Remove item from watchlist by watchlist ID
const removeWatchlistItemById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success : false,
      message: 'Unauthorized'
     });
    return;
  }

  const { watchlistId } = req.params;
  if (!watchlistId) {
    res.status(400).json({
      success: false,
      message: 'Watchlist ID is required'
    });
    return;
  }
  const result = await removeFromWatchlistById(userId, watchlistId);
  if (!result) {
    res.status(404).json({
      success: false,
      message: 'Item not found in watchlist'
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Item removed from watchlist',
    dataItem: result
  });
  } catch (error) {
    console.log("Error removing from watchlist:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's watchlist with optional filters
const getWatchlist: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success : false,
      message: 'Unauthorized'
     });
    return;
  }

  // pagination (use your helper)
  const { page, limit } = parsePageParams(req.query);

  // filters
  const targetKindRaw = req.query.targetKind;
  const kind: WatchTargetKind | undefined = isWatchTargetKind(targetKindRaw) ? targetKindRaw : undefined;

  const isMutedRaw = typeof req.query.isMuted === 'string' ? req.query.isMuted.toLowerCase() : undefined;
  const muted = isMutedRaw === 'true' ? true : isMutedRaw === 'false' ? false : undefined;
  const sortRaw = (req.query.sortBy as string | undefined) ?? 'createdAt:desc';
  const [field, dir] = sortRaw.split(':');
  const sort = { [(field && field.length ? field : 'createdAt')]: dir?.toLowerCase() === 'asc' ? 1 : -1 as 1 | -1 };
  const populate = (req.query.populate as string | undefined)?.toLowerCase() === 'true';

  const { items, total, pages } = await getUserWatchlist(userId, {
    kind,
    muted,
    page,
    limit,
    sort,
    populate,
  });

  const meta = buildMeta(total, page, limit);
  res.status(200).json({
    success: true,
    message: 'Watchlist retrieved successfully',
    dataList: items,
    meta,
    pages,
  });
  } catch (error) {
    console.log("Error fetching watchlist:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single watchlist item by ID
const getWatchlistItemById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success : false,
      message: 'Unauthorized'
     });
    return;
  }

  const { watchlistId } = req.params;
  if (!watchlistId) {
    res.status(400).json({
      success: false,
      message: 'Watchlist ID is required'
    });
    return;
  }
  const { populate = 'false' } = req.query;
  const item = await getWatchlistItem(userId, watchlistId, populate === 'true');
  if (!item) {
    res.status(404).json({
      success: false,
      message: 'Watchlist item not found'
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Watchlist item retrieved successfully',
    dataItem: item
  });
  } catch (error) {
    console.log("Error fetching watchlist item:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update watchlist item
const updateWatchlistItemById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success : false,
      message: 'Unauthorized'
     });
    return;
  }
  const { watchlistId } = req.params;
  if (!watchlistId) {
    res.status(400).json({
      success: false,
      message: 'Watchlist ID is required'
    });
    return;
  }
  const { title, labels, isMuted, notifyOn, meta } = req.body;
  if (title === undefined && labels === undefined && isMuted === undefined && notifyOn === undefined && meta === undefined) {
    res.status(400).json({
      success: false,
      message: 'At least one field (title, labels, isMuted, notifyOn, meta) must be provided for update'
    });
    return;
  }
  const updatedItem = await updateWatchlistItem(userId, watchlistId, { title, labels, isMuted, notifyOn, meta });
  if (!updatedItem) {
    res.status(404).json({
      success: false,
      message: 'Watchlist item not found'
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Watchlist item updated successfully',
    dataItem: updatedItem
  });
  } 
  catch (error) {
    console.log("Error updating watchlist item:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mute/unmute watchlist item
const muteUnmuteWatchlistItem: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success : false,
      message: 'Unauthorized'
      });
    return;
  }

  const { watchlistId } = req.params;
  if (!watchlistId) {
    res.status(400).json({
      success: false,
      message: 'Watchlist ID is required'
    });
    return;
  }
  const { isMuted } = req.body;
  if (isMuted === undefined) {
    res.status(400).json({
      success: false,
      message: 'isMuted field is required'
    });
    return;
  }

  const updatedItem = await muteWatchlistItem(userId, watchlistId, isMuted);
  if (!updatedItem) {
    res.status(404).json({
      success: false,
      message: 'Watchlist item not found'
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: `Watchlist item ${isMuted ? 'muted' : 'unmuted'} successfully`,
    dataItem: updatedItem
  });
  } catch (error) {
    console.log("Error muting/unmuting watchlist item:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update notification rules for watchlist item
const updateWatchlistNotifyRules: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({
      success : false,
      message: 'Unauthorized'
    });
    return;
  }

  const { watchlistId } = req.params;
  if (!watchlistId) {
    res.status(400).json({
      success: false,
      message: 'Watchlist ID is required'
    });
    return;
  }
  const { rules } = req.body;
  if (!rules || typeof rules !== 'object') {
    res.status(400).json({
      success: false,
      message: 'Valid rules object is required'
    });
    return;
  }
  const updatedItem = await updateNotifyRules(userId, watchlistId, rules);
  if (!updatedItem) {
    res.status(404).json({
      success: false,
      message: 'Watchlist item not found'
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Notification rules updated successfully',
    dataItem: updatedItem
  });
  } catch (error) {
    console.log("Error updating notification rules:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add labels to watchlist item
const addLabelsToWatchlistItem: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const { watchlistId } = req.params;
    if (!watchlistId) {
      res.status(400).json({
        success: false,
        message: 'Watchlist ID is required'
      });
      return;
    }

    const { labels } = req.body;
    if (!Array.isArray(labels) || labels.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Valid labels array is required'
      });
      return;
    }

    const updatedItem = await addLabels(userId, watchlistId, labels);
    if (!updatedItem) {
      res.status(404).json({
        success: false,
        message: 'Watchlist item not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Labels added successfully',
      dataItem: updatedItem
    });
  } catch (error) {
    console.log("Error adding labels to watchlist item:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


// Remove label from watchlist item
const removeLabelFromWatchlistItem: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }
    const { watchlistId, label } = req.params;
    if (!watchlistId || !label) {
      res.status(400).json({
        success: false,
        message: 'Watchlist ID and label are required'
      });
      return;
    }
    const updatedItem = await removeLabel(userId, watchlistId, label);
    if (!updatedItem) {
      res.status(404).json({
        success: false,
        message: 'Watchlist item not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Label removed successfully',
      dataItem: updatedItem
    });
  } catch (error) {
    console.log("Error removing label from watchlist item:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helpers for jobs / notifications
const getCountryWatchers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { countryCode } = req.params;
    if (!countryCode) {
      res.status(400).json({
        success: false,
        message: 'Country code is required'
      });
      return;
    }
    const watchers = await findCountryWatchers(countryCode);
    res.status(200).json({
      success: true,
      message: 'Country watchers retrieved successfully',
      dataList: watchers
    });
  } catch (error) {
    console.log("Error fetching country watchers:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

const getTripReminderWatchers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    if (!tripId) {
      res.status(400).json({
        success: false,
        message: 'Trip ID is required'
      });
      return;
    }

    const watchers = await findTripReminderWatchers();
    res.status(200).json({
      success: true,
      message: 'Trip reminder watchers retrieved successfully',
      dataList: watchers
    });
  } catch (error) {
    console.log("Error fetching trip reminder watchers:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


export {
  addWatchlistItem,
  removeWatchlistItemByTarget,
  getCountryWatchers,
  getTripReminderWatchers,
  removeWatchlistItemById,
  getWatchlist,
  getWatchlistItemById,
  updateWatchlistItemById,
  muteUnmuteWatchlistItem,
  updateWatchlistNotifyRules,
  addLabelsToWatchlistItem,
  removeLabelFromWatchlistItem
};