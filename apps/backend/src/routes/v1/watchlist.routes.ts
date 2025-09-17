import express, { Router } from 'express';
import { addWatchlistItem, removeWatchlistItemByTarget, getCountryWatchers, getTripReminderWatchers, removeWatchlistItemById, getWatchlist, getWatchlistItemById, updateWatchlistItemById, muteUnmuteWatchlistItem, updateWatchlistNotifyRules, addLabelsToWatchlistItem, removeLabelFromWatchlistItem  } from '../../modules/controllers/watchlists.controller';

const router: Router = express.Router();


router.post(
  "/watchlist",
  // requireAuth,
  addWatchlistItem
);


router.delete(
  "/watchlist/target",
  // requireAuth,
  removeWatchlistItemByTarget
);

// Remove by watchlist doc id
router.delete(
  "/watchlist/:watchlistId",
  // requireAuth,
  removeWatchlistItemById
);


router.get(
  "/watchlist",
  // requireAuth,
  getWatchlist
);


router.get(
  "/watchlist/:watchlistId",
  // requireAuth,
  getWatchlistItemById
);


router.patch(
  "/watchlist/:watchlistId",
  // requireAuth,
  updateWatchlistItemById
);

// Mute/unmute
router.patch(
  "/watchlist/:watchlistId/mute",
  // requireAuth,
  muteUnmuteWatchlistItem
);


router.patch(
  "/watchlist/:watchlistId/notify",
  // requireAuth,
  updateWatchlistNotifyRules
);


router.post(
  "/watchlist/:watchlistId/labels",
  // requireAuth,
  addLabelsToWatchlistItem
);
router.delete(
  "/watchlist/:watchlistId/labels/:label",
  // requireAuth,
  removeLabelFromWatchlistItem
);


router.get(
  "/watchers/countries/:countryCode",
  // requireAuth, // or admin-only if sensitive
  getCountryWatchers
);
router.get(
  "/watchers/trips/:tripId",
  // requireAuth, // or admin-only if sensitive
  getTripReminderWatchers
);



export default router;