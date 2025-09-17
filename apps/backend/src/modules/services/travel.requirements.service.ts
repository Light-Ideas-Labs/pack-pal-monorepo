import { addDays } from 'date-fns';
import TravelRequirementModel, { ITravelRequirement } from '../models/travel-requirement/model';


type RequirementsKey = {
  to: string;
  citizenship: string;
  residence?: string | null;
  transit: string[];
};

const normalizeReqKey = (k: RequirementsKey) => ({
  to: k.to.toUpperCase(),
  citizenship: k.citizenship.toUpperCase(),
  residence: k.residence ? k.residence.toUpperCase() : null,
  transit: [...(k.transit || [])].map((t) => t.toUpperCase()).sort(),
});


  /** Get cached or fetch new requirement data. */ // default 7 days TTL
const getOrFetch = async (opts: {to: string; citizenship: string; residence?: string; transit?: string[]; ttlDays?: number; forceRefresh?: boolean; }) => {
    const key = normalizeReqKey({
      to: opts.to,
      citizenship: opts.citizenship,
      residence: opts.residence ?? null,
      transit: opts.transit ?? [],
    });
    const now = new Date();
    const ttlDays = Math.max(1, opts.ttlDays ?? 7);

    if (!opts.forceRefresh) {
      const cached = await TravelRequirementModel.findOne({
        'to.code': key.to,
        citizenship: key.citizenship,
        residence: key.residence,
        transit: key.transit,
        validUntil: { $gt: now },
      }).lean<ITravelRequirement | null>();
      if (cached) return { cached: true, data: cached };
    }

    // Fetch from providers and merge
    const merged = await fetchFromProviders(key);

    // Upsert with TTL
    const saved = await TravelRequirementModel.findOneAndUpdate(
      {
        'to.code': key.to,
        citizenship: key.citizenship,
        residence: key.residence,
        transit: key.transit,
      },
      {
        ...merged,
        fetchedAt: now,
        validUntil: addDays(now, ttlDays),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return { cached: false, data: saved };
  }

  /**
   * Provider aggregation stub. Plug in Timatic/Sherpa/Gov sources here.
   * Return a shape compatible with ITravelRequirement (minus key fields).
   */
const fetchFromProviders = async (key: RequirementsKey): Promise<Partial<ITravelRequirement>> => {
    // TODO: Replace with real provider calls.
    // Example merge logic preference order:
    // 1) Timatic visa core → 2) Sherpa additions → 3) Gov advisory/health (latest timestamp)
    const now = new Date();

    // Dummy example (Kenya passport to TZ):
    const exampleVisa =
      key.citizenship === 'KE' && key.to === 'TZ'
        ? { required: false, type: 'visa_free', maxStayDays: 90, notes: 'EAC citizens visa-free.' }
        : { required: true, type: 'evisa' as const, url: 'https://evisa.example.com' };

    const advisory = { level: 2, label: 'Exercise increased caution', source: 'gov', updatedAt: now };

    return {
      to: { code: key.to },
      from: key.residence ? { code: key.residence } : undefined,
      citizenship: key.citizenship,
      residence: key.residence ?? undefined,
      transit: key.transit,
      passport: { minValidityMonths: 6, blankPages: 2, machineReadable: true, biometric: true },
      visa: exampleVisa as any,
      entry: { onwardTicketRequired: false, fundsProofRequired: false, accommodationProofRequired: false },
      health: { vaccinations: [], insuranceRequired: false },
      customs: {},
      driving: {},
      advisory,
      provider: 'mixed',
      sources: [
        { name: 'gov', url: 'https://example.gov/advisory', checkedAt: now },
      ],
      fetchedAt: now,
      validUntil: addDays(now, 7),
    };
  }

/** Remove expired TravelRequirements */
const pruneExpiredRequirements = async (now = new Date()) => {
    try {
        const res = await TravelRequirementModel.deleteMany({ validUntil: { $lt: now } });
        return { ok: true, deleted: res.deletedCount ?? 0 };
      } catch (error) {
        console.error('Error pruning expired requirements:', error);
        return { ok: false, error: 'Failed to prune expired requirements' };
      }
}

export {
    getOrFetch,
    pruneExpiredRequirements
}