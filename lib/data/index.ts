// ============================================================
// CreditOS — Data Layer Re-exports
// ============================================================

// Types
export type {
  CardKey,
  CardInfo,
  Cards,
  BenefitCadence,
  BenefitCategory,
  Benefit,
  SetupPriority,
  SetupTask,
  EvidenceLevel,
  Tip,
  SourceType,
  Source,
  TravelToolCategory,
  TravelTool,
  EvidenceLevelMeta,
  BestCardRecommendation,
  BestCardDecision,
  ActionPriority,
  ActionItem,
} from './types';

// Data
export { CARDS, BENEFITS } from './benefits';
export { CHECKLIST_ITEMS } from './checklist';
export { TIPS, EVIDENCE_LEVELS } from './tips';
export { TRAVEL_TOOLS } from './tools';
export { SOURCES } from './sources';
export { BEST_CARD_RULES } from './best-card';
export { getActionItems } from './actions';
