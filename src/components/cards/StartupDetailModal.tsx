import { useEffect } from 'react';
import type { EnergyStartup } from '../../types/startup';
import {
  DEV_PHASE_META,
  ENERGY_TYPE_META,
  FUNDING_STAGE_META,
  MARKET_SEGMENT_META,
  formatFunding,
} from '../../utils/classify';

interface Props {
  startup: EnergyStartup | null;
  onClose: () => void;
}

export function StartupDetailModal({ startup, onClose }: Props) {
  useEffect(() => {
    if (!startup) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [startup, onClose]);

  if (!startup) return null;

  const phase = DEV_PHASE_META[startup.devPhase];
  const funding = FUNDING_STAGE_META[startup.fundingStage];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{startup.name}</h2>
              {startup.city && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {startup.city}, {startup.country}
                  {startup.founded ? ` · Founded ${startup.founded}` : ''}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0 cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed">{startup.description}</p>

          {startup.keyTechnology && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
              <span className="font-medium">Technology: </span>
              {startup.keyTechnology}
            </div>
          )}

          {/* Classification grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Energy type</p>
              <div className="flex flex-wrap gap-1">
                {startup.energyTypes.map((t) => (
                  <span
                    key={t}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${ENERGY_TYPE_META[t].bgColor} ${ENERGY_TYPE_META[t].color}`}
                  >
                    {ENERGY_TYPE_META[t].label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Dev phase</p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${phase.bgColor} ${phase.color}`}
              >
                {phase.label}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Funding stage</p>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${funding.bgColor} ${funding.color}`}
              >
                {funding.label}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Market segment</p>
              <div className="flex flex-wrap gap-1">
                {startup.marketSegments.map((m) => (
                  <span
                    key={m}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${MARKET_SEGMENT_META[m].bgColor} ${MARKET_SEGMENT_META[m].color}`}
                  >
                    {MARKET_SEGMENT_META[m].label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Funding details */}
          {(startup.totalFundingUsd || startup.latestRoundUsd || startup.investors?.length) && (
            <div className="border border-gray-100 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Funding
              </p>
              {startup.totalFundingUsd && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total raised</span>
                  <span className="font-semibold text-gray-900">
                    {formatFunding(startup.totalFundingUsd)}
                  </span>
                </div>
              )}
              {startup.latestRoundUsd && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Latest round</span>
                  <span className="text-gray-700">
                    {formatFunding(startup.latestRoundUsd)}
                    {startup.latestRoundDate
                      ? ` (${new Date(startup.latestRoundDate).getFullYear()})`
                      : ''}
                  </span>
                </div>
              )}
              {startup.investors && startup.investors.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-500">Investors: </span>
                  <span className="text-gray-700">{startup.investors.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visit website ↗
            </a>
            {startup.crunchbaseUrl && (
              <a
                href={startup.crunchbaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Crunchbase ↗
              </a>
            )}
            {startup.linkedinUrl && (
              <a
                href={startup.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                LinkedIn ↗
              </a>
            )}
          </div>

          {startup.classificationConfidence < 0.5 && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              ⚠ Low confidence classification — manual review recommended
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
