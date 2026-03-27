import type { Fighter } from "../types/battle";

type FighterPanelProps = {
  fighter: Fighter;
  level?: number;
  side: "enemy" | "player";
};

function getHpBarColor(percent: number): string {
  if (percent > 50) return "#58d858";
  if (percent > 20) return "#f8c800";
  return "#e82000";
}

export function FighterPanel({ fighter, level, side }: FighterPanelProps) {
  const hpPercent = (fighter.hp / fighter.maxHp) * 100;
  const barColor = getHpBarColor(hpPercent);
  const levelLabel = level != null ? `Lv.${level}` : "Lv.--";

  if (side === "enemy") {
    return (
      <div className="border-[2px] border-black bg-white px-2 py-1 w-[48%] min-w-[120px]">
        <div className="flex justify-between items-baseline mb-1">
          <span className="txt-panel-name">{fighter.name}</span>
          <span className="txt-panel-level">{levelLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="txt-panel-hp-label shrink-0">HP</span>
          <div className="flex-1 h-[4px] border border-black bg-[#d0d0d0]">
            <div
              className="h-full transition-[width,background-color] duration-700 ease-out"
              style={{ width: `${hpPercent}%`, backgroundColor: barColor }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-[2px] border-black bg-white px-2 py-1 w-[48%] min-w-[120px]">
      <div className="flex justify-between items-baseline mb-1">
        <span className="txt-panel-name">{fighter.name}</span>
        <span className="txt-panel-level">{levelLabel}</span>
      </div>
      <div className="flex items-center gap-1 mb-1">
        <span className="txt-panel-hp-label shrink-0">HP</span>
        <div className="flex-1 h-[4px] border border-black bg-[#d0d0d0]">
          <div
            className="h-full transition-[width,background-color] duration-700 ease-out"
            style={{ width: `${hpPercent}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
      <div className="text-right txt-panel-hp-value">
        {fighter.hp}/{fighter.maxHp}
      </div>
    </div>
  );
}
