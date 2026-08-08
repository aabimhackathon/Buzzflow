# Vepari AI Authoritative Assets Documentation

This document serves as the official registry for all 11 authoritative Vepari AI brand and engine assets preserved in the codebase.

## Overview

All Vepari AI assets are centralized and exposed via the unified asset configuration in `packages/config/assets.ts` and re-exported through `src/config/assets.ts`.

---

## Authoritative Asset Registry

| # | Asset File Name | Category | Primary Purpose & Usage | Configuration Reference |
|---|---|---|---|---|
| 1 | `App icon.png` | Branding | Main application icon, favicon, header logo, gate branding | `VEPARI_ASSETS.appIcon` |
| 2 | `brand.png` | Branding | Vepari AI brand identity & corporate onboarding banner | `VEPARI_ASSETS.brand` |
| 3 | `automation engine.png` | Engines | Automation Engine visual indicator for double-entry automation | `VEPARI_ASSETS.engines.automation` |
| 4 | `finance engine.png` | Engines | Finance Engine visual header in `FinanceEngineView.tsx` | `VEPARI_ASSETS.engines.finance` |
| 5 | `growth engine.png` | Engines | Growth Engine visual header in `SchemesEngineView.tsx` | `VEPARI_ASSETS.engines.growth` |
| 6 | `intelligence engine.png` | Engines | Intelligence Engine visual in `IntelligenceEngineView.tsx` | `VEPARI_ASSETS.engines.intelligence` |
| 7 | `market engine.png` | Engines | Market Engine visual for MSME market intelligence | `VEPARI_ASSETS.engines.market` |
| 8 | `memory engine.png` | Engines | Memory Engine visual in `MemoryEngineView.tsx` | `VEPARI_ASSETS.engines.memory` |
| 9 | `vision engine.png` | Engines | Vision Engine visual for OCR & invoice vision recognition | `VEPARI_ASSETS.engines.vision` |
| 10 | `voice engine.png` | Engines | Voice & AI Assistant visual in `AiAssistant.tsx` | `VEPARI_ASSETS.engines.voice` |
| 11 | `lightbulb_tips.png` | UI | Lightbulb Tips visual for UI guided prompts & tips | `VEPARI_ASSETS.ui.lightbulbTips` |

---

## Workspace Directory Structure

The assets are stored in two mirrored locations to support both direct imports and static public serving:

```text
/
├── assets/
│   ├── branding/
│   │   ├── App icon.png
│   │   └── brand.png
│   ├── engines/
│   │   ├── automation engine.png
│   │   ├── finance engine.png
│   │   ├── growth engine.png
│   │   ├── intelligence engine.png
│   │   ├── market engine.png
│   │   ├── memory engine.png
│   │   ├── vision engine.png
│   │   └── voice engine.png
│   └── ui/
│       └── lightbulb_tips/
│           └── lightbulb_tips.png
│
├── public/
│   └── assets/
│       ├── branding/ ...
│       ├── engines/ ...
│       └── ui/ ...
```

---

## Code Usage Pattern

Always import from `src/config/assets.ts` or `packages/config/assets.ts`:

```typescript
import { VEPARI_ASSETS } from '@/config/assets';

// Usage Examples:
<img src={VEPARI_ASSETS.appIcon} alt="Vepari AI" />
<img src={VEPARI_ASSETS.engines.finance} alt="Finance Engine" />
<img src={VEPARI_ASSETS.engines.voice} alt="Voice AI Assistant" />
```
