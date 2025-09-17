// seeds/seedPlans.ts
import Plan from '../models/Plan';
import { FeatureMatrix } from '../models/FeatureMatrix';

export async function seedPlans() {
  const matrix = await FeatureMatrix.findOne() || await FeatureMatrix.create({
    items: [
      { label: 'Trips', tiers: { free: 'Up to 3', pro: 'Unlimited', teams: 'Unlimited (workspace)' } },
      { label: 'Documents storage', tiers: { free: '50 MB', pro: '10 GB', teams: '100 GB pooled' } },
      { label: 'Maps & saved places', tiers: { free: '10 per trip', pro: 'Unlimited', teams: 'Unlimited' } },
      { label: 'Files per trip', tiers: { free: '5', pro: 'Unlimited', teams: 'Unlimited' } },
      { label: 'Packing lists', tiers: { free: '2 templates', pro: 'Unlimited + reusable', teams: 'Unlimited + org templates' } },
      { label: 'Sharing & roles', tiers: { free: '1 viewer', pro: 'Up to 5 editors/viewers', teams: 'Unlimited seats, Admin/Editor/Viewer' } },
      { label: 'Offline', tiers: { free: 'Recent items cached', pro: 'Full offline + background sync', teams: 'Full offline + background sync' } },
      { label: 'Export', tiers: { free: '—', pro: 'PDF / CSV / ICS', teams: 'PDF / CSV / ICS' } },
      { label: 'Backups', tiers: { free: '—', pro: 'Cloud backup & restore', teams: 'Cloud backup & restore' } },
      { label: 'Themes', tiers: { free: '2', pro: '12 color themes', teams: '12 color themes + org defaults' } },
      { label: 'Reminders & widgets (Android)', tiers: { free: 'Basic', pro: 'Smart packing + travel-day widgets', teams: 'Smart packing + travel-day widgets' } },
      { label: 'Admin & analytics', tiers: { free: '—', pro: '—', teams: 'Workspace analytics & audit log' } },
      { label: 'Support', tiers: { free: 'Community / email', pro: 'Priority email', teams: 'Priority + onboarding' } },
    ]
  });

  await Plan.findOneAndUpdate({ name: 'free' }, {
    name: 'free',
    description: 'Up to 3 trips, light storage.',
    prices: [],
    limits: { trips: 3, storageMB: 50, mapsPerTrip: 10, filesPerTrip: 5, packingTemplates: 2 },
    flags: { export: false, backups: false, offline: true, adminAnalytics: false },
    order: 0,
    featureMatrixRef: matrix._id
  }, { upsert: true });

  await Plan.findOneAndUpdate({ name: 'pro' }, {
    name: 'pro',
    description: 'Unlimited trips, powerful extras.',
    prices: [
      { interval: 'monthly', amount: 399, currency: 'USD', subtitle: 'Billed Monthly' },
      { interval: 'yearly',  amount: 1799, currency: 'USD', subtitle: 'Billed Yearly', badge: 'Save 62%' },
    ],
    limits: { trips: -1, storageMB: 10_000, mapsPerTrip: -1, filesPerTrip: -1, packingTemplates: -1 },
    flags: { export: true, backups: true, offline: true, adminAnalytics: false },
    order: 1,
    featureMatrixRef: matrix._id,
    storefront: { androidProductIds: ['packpal_pro_monthly', 'packpal_pro_yearly'] }
  }, { upsert: true });

  await Plan.findOneAndUpdate({ name: 'teams' }, {
    name: 'teams',
    description: 'Shared workspaces for friends, families, and teams.',
    prices: [], // handled by sales/custom quotes
    limits: { trips: -1, storageMB: 100_000, mapsPerTrip: -1, filesPerTrip: -1, packingTemplates: -1 },
    flags: { export: true, backups: true, offline: true, adminAnalytics: true },
    order: 2,
    featureMatrixRef: matrix._id
  }, { upsert: true });
}
