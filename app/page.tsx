"use client";

import { useEffect, useRef, useState } from "react";
import { useBattle } from "./hooks/useBattle";
import { FighterPanel } from "./components/FighterPanel";
import { BattleLog } from "./components/BattleLog";
import { MoveButtons } from "./components/MoveButtons";
import { MESSAGE_DELAY_MS } from "./data/fighters";

const INITIAL_LOG_MESSAGE = "앗! 야생의 교수님이 나타났다!!";

export default function Page() {
  const { state, logRef, runPlayerTurn } = useBattle();
  const [displayIndex, setDisplayIndex] = useState(0);
  const [logReadyForMenu, setLogReadyForMenu] = useState(true);
  const prevLogLengthRef = useRef(state.log.length);
  const logReadyForMenuRef = useRef(true);

  const log = state.log;
  const isProcessing = state.status === "processing";

  useEffect(() => {
    if (log.length === 0) {
      setDisplayIndex(0);
      setLogReadyForMenu(true);
      logReadyForMenuRef.current = true;
      prevLogLengthRef.current = 0;
    } else if (log.length > prevLogLengthRef.current) {
      const prevLength = prevLogLengthRef.current;
      prevLogLengthRef.current = log.length;
      // 메뉴 대기 상태(마지막 로그 표시 완료)에서 새 로그가 들어오면 즉시 점프
      if (logReadyForMenuRef.current) {
        setDisplayIndex(prevLength);
      }
      setLogReadyForMenu(false);
      logReadyForMenuRef.current = false;
    }
  }, [log.length]);

  useEffect(() => {
    if (isProcessing) {
      setLogReadyForMenu(false);
      logReadyForMenuRef.current = false;
    }
  }, [isProcessing]);

  useEffect(() => {
    if (log.length === 0) return;
    if (displayIndex < log.length - 1) {
      const id = window.setTimeout(() => setDisplayIndex((i) => i + 1), MESSAGE_DELAY_MS);
      return () => clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setLogReadyForMenu(true);
      logReadyForMenuRef.current = true;
    }, MESSAGE_DELAY_MS);
    return () => clearTimeout(id);
  }, [log.length, displayIndex, log]);

  const currentLine = log.length === 0 ? null : log[Math.min(displayIndex, log.length - 1)];
  const hasMore = log.length > 0 && displayIndex < log.length - 1;
  const showMoveMenu = state.status === "idle" && (log.length === 0 || logReadyForMenu);

  return (
    <div className="w-full bg-[#e8e0d0] flex items-center justify-center py-4">
      {/* 해상도: 640×576 */}
      <main
        className="game-viewport relative flex flex-col bg-[#f0f0e8] overflow-hidden border-4 border-[#1a1a1a]"
        style={{ imageRendering: "pixelated" }}
      >
        {/* 배틀 필드 */}
        <div className="relative flex-1 border-b-[2px] border-black">
          {/* 적 info 박스 — 상단 좌측 */}
          <div className="absolute top-[6%] left-[3%]">
            <FighterPanel fighter={state.enemy} side="enemy" />
          </div>

          {/* 적 스프라이트 공간 — 상단 우측 */}
          <div
            className="absolute top-[6%] right-[4%] w-[35%] aspect-square"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paper.png" alt="논문" className="w-full h-full object-contain" style={{ imageRendering: "pixelated" }} />
          </div>

          {/* 플레이어 스프라이트 공간 — 하단 좌측 */}
          <div
            className="absolute bottom-[6%] left-[4%] w-[35%] aspect-square"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/student.png" alt="대학원생" className="w-full h-full object-contain" style={{ imageRendering: "pixelated" }} />
          </div>

          {/* 플레이어 info 박스 — 하단 우측 */}
          <div className="absolute bottom-[6%] right-[3%]">
            <FighterPanel fighter={state.player} level={state.player.level} side="player" />
          </div>
        </div>

        {/* UI 영역 */}
        <div className="relative bg-white" style={{ height: "28%" }}>
          <BattleLog
            logRef={logRef}
            currentLine={currentLine}
            emptyMessage={INITIAL_LOG_MESSAGE}
            hasMore={hasMore}
          />
          {showMoveMenu && (
            <div className="absolute inset-0">
              <MoveButtons
                moves={state.player.moves}
                status={state.status}
                onMove={runPlayerTurn}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
