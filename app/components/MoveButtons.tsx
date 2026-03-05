"use client";

import { useEffect, useState } from "react";
import type { BattleStatus, Move } from "../types/battle";

type MoveButtonsProps = {
  moves: Move[];
  status: BattleStatus;
  onMove: (index: number) => void;
};

// 2×2 그리드 기준 방향키 이동
const ARROW_DELTA: Record<string, number> = {
  ArrowRight: 1,
  ArrowLeft: -1,
  ArrowDown: 2,
  ArrowUp: -2,
};

export function MoveButtons({ moves, status, onMove }: MoveButtonsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const isIdle = status === "idle";
  const isGameOver = status === "won" || status === "lost";
  const canAct = isIdle && !isGameOver;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!canAct) return;

      if (e.key in ARROW_DELTA) {
        e.preventDefault();
        setHoveredIndex((prev) => {
          const next = prev + ARROW_DELTA[e.key];
          if (next < 0 || next >= moves.length) return prev;
          return next;
        });
        return;
      }

      if (e.key === "Enter" || e.key === "z" || e.key === "Z") {
        const move = moves[hoveredIndex];
        if (move && move.pp > 0) onMove(hoveredIndex);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canAct, hoveredIndex, moves, onMove]);

  const selectedMove = hoveredIndex != null ? moves[hoveredIndex] : null;

  return (
    <section className="h-full flex flex-col border-t-[2px] border-black bg-white">
      <div className="flex flex-1 min-h-0">
        {/* 기술 2×2 그리드 */}
        <div className="flex-1 grid grid-cols-2 border-r-[2px] border-black">
          {moves.map((move, index) => {
            const isHovered = hoveredIndex === index;
            const isDisabled = !canAct || move.pp <= 0;
            return (
              <button
                key={move.name}
                type="button"
                className={`flex items-center gap-1 px-2 text-[11px] text-left font-[inherit] border-none bg-transparent cursor-pointer
                  ${isDisabled ? "opacity-40 cursor-not-allowed" : "active:bg-gray-100"}
                  ${index < 2 ? "border-b border-gray-200" : ""}
                `}
                onClick={() => onMove(index)}
                disabled={isDisabled}
                onMouseEnter={() => setHoveredIndex(index)}
                onTouchStart={() => setHoveredIndex(index)}
              >
                <span className={`text-[11px] shrink-0 ${isHovered && !isDisabled ? "visible" : "invisible"}`}>
                  ▶
                </span>
                <span className="leading-[1.4]">{move.name}</span>
              </button>
            );
          })}
        </div>

        {/* PP / TYPE 패널 */}
        <div className="w-[30%] max-w-[100px] px-2 text-[10px] leading-[2] flex flex-col justify-center">
          {selectedMove ? (
            <>
              <div>
                <span className="text-gray-500">PP</span>
                <br />{selectedMove.pp}/{selectedMove.maxPp}
              </div>
              <div>
                <span className="text-gray-500">TYPE</span>
                <br />{selectedMove.type ?? "—"}
              </div>
            </>
          ) : (
            <>
              <div><span className="text-gray-500">PP</span><br />—</div>
              <div><span className="text-gray-500">TYPE</span><br />—</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
