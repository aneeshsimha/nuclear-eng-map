import type { EnergyStartup } from '../../types/startup';
import {
  DEV_PHASE_META,
  ENERGY_TYPE_META,
  FUNDING_STAGE_META,
  formatFunding,
} from '../../utils/classify';

interface Props {
  startup: EnergyStartup;
  onClick: () => void;
}

function LetterAvatar({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function StartupCard({ startup, onClick }: Props) {
  const phase = DEV_PHASE_META[startup.devPhase];
  const funding = FUNDING_STAGE_META[startup.fundingStage];

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-blue-300 transition-all cursor-pointer w-full"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {startup.logoUrl ? (
          <img
            src={startup.logoUrl}
            alt={startup.name}
            className="w-10 h-10 rounded-lg object-contain border border-gray-100 flex-shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <LetterAvatar name={startup.name} />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
            {startup.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {startup.city ? `${startup.city}, ` : ''}
            {startup.country}
            {startup.founded ? ` · Est. ${startup.founded}` : ''}
          </p>
        </div>
        {startup.classificationConfidence < 0.5 && (
          <span
            title="Low classification confidence — needs review"
            className="text-amber-400 text-xs flex-shrink-0"
          >
            ⚠
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{startup.description}</p>

      {/* Energy type chips */}
      <div className="flex flex-wrap gap-1 mb-2">
        {startup.energyTypes.map((t) => (
          <span
            key={t}
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${ENERGY_TYPE_META[t].bgColor} ${ENERGY_TYPE_META[t].color}`}
          >
            {ENERGY_TYPE_META[t].label}
          </span>
        ))}
      </div>

      {/* Phase + Funding row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${phase.bgColor} ${phase.color}`}
        >
          {phase.label}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${funding.bgColor} ${funding.color}`}
        >
          {funding.label}
        </span>
        {startup.totalFundingUsd && (
          <span className="ml-auto text-xs font-medium text-gray-700">
            {formatFunding(startup.totalFundingUsd)}
          </span>
        )}
      </div>
    </button>
  );
}
