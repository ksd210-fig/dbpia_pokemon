"use client";

import { useEffect, useRef, useState } from "react";
import { useBattle } from "./hooks/useBattle";
import { FighterPanel } from "./components/FighterPanel";
import { BattleLog } from "./components/BattleLog";
import { MoveButtons } from "./components/MoveButtons";
import { MESSAGE_DELAY_MS } from "./data/fighters";

const INTRO_CHAR_DELAY_MS = 80;
const INTRO_POST_DELAY_MS = 1500;
const INTRO_MESSAGES = ["앗! 야생의 \n논문(이)가 \n나타났다!", "가랏! 대학원생!"];

export default function Page() {
  const { state, logRef, runPlayerTurn, handleRestart, hitTarget } = useBattle();
  const [displayIndex, setDisplayIndex] = useState(0);
  const [logReadyForMenu, setLogReadyForMenu] = useState(true);
  const prevLogLengthRef = useRef(state.log.length);
  const logReadyForMenuRef = useRef(true);
  const [introStep, setIntroStep] = useState(0); // 0,1 = intro messages, 2 = done

  // BGM: 첫 번째 사용자 인터랙션 후 재생 (브라우저 자동재생 정책 대응)
  useEffect(() => {
    const bgm = new Audio('/pokemon-battle.mp3');
    bgm.loop = true;
    bgm.volume = 0.6;

    const start = () => {
      bgm.play().catch(() => {});
      document.removeEventListener('click', start);
      document.removeEventListener('keydown', start);
    };

    bgm.play().catch(() => {
      document.addEventListener('click', start);
      document.addEventListener('keydown', start);
    });

    return () => {
      bgm.pause();
      document.removeEventListener('click', start);
      document.removeEventListener('keydown', start);
    };
  }, []);

  // 인트로 시퀀스: 각 메시지 타이핑 완료 후 다음 단계로 진행
  useEffect(() => {
    if (introStep >= INTRO_MESSAGES.length) return;
    const msg = INTRO_MESSAGES[introStep];
    const typingMs = msg.length * INTRO_CHAR_DELAY_MS;
    const id = window.setTimeout(
      () => setIntroStep((s) => s + 1),
      typingMs + INTRO_POST_DELAY_MS
    );
    return () => clearTimeout(id);
  }, [introStep]);

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

  const introDone = introStep >= INTRO_MESSAGES.length;
  const isGameOver = state.status === "won" || state.status === "lost";
  const showPanels = introDone && !isGameOver;
  const currentLine = !introDone
    ? INTRO_MESSAGES[introStep]
    : log.length === 0
    ? null
    : log[Math.min(displayIndex, log.length - 1)];
  const hasMore = introDone && log.length > 0 && displayIndex < log.length - 1;
  const showMoveMenu = introDone && state.status === "idle" && (log.length === 0 || logReadyForMenu);
  const showGameOverMenu = isGameOver && logReadyForMenu;

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
          {showPanels && (
            <div className="absolute top-[6%] left-[3%]">
              <FighterPanel fighter={state.enemy} level={state.enemy.level} side="enemy" />
            </div>
          )}

          {/* 적 스프라이트 공간 — 상단 우측 */}
          <div
            className="absolute top-[6%] right-[4%] w-[35%] aspect-square"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paper.png" alt="논문" className={`w-full h-full object-contain${hitTarget === "enemy" ? " hit-flash" : ""}`} style={{ imageRendering: "pixelated" }} />
          </div>

          {/* 플레이어 스프라이트 공간 — 하단 좌측 */}
          <div
            className="absolute bottom-[6%] left-[4%] w-[35%] aspect-square"
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/student.png" alt="대학원생" className={`w-full h-full object-contain${hitTarget === "player" ? " hit-flash" : ""}`} style={{ imageRendering: "pixelated" }} />
          </div>

          {/* 플레이어 info 박스 — 하단 우측 */}
          {showPanels && (
            <div className="absolute bottom-[6%] right-[3%]">
              <FighterPanel fighter={state.player} level={state.player.level} side="player" />
            </div>
          )}
        </div>

        {/* UI 영역 */}
        <div className="relative bg-white" style={{ height: "28%" }}>
          <BattleLog
            logRef={logRef}
            currentLine={currentLine}
            emptyMessage=""
            hasMore={hasMore}
            charDelayMs={introDone ? undefined : INTRO_CHAR_DELAY_MS}
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
          {showGameOverMenu && (
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-white border-t-[2px] border-black px-3">
              <button
                type="button"
                onClick={handleRestart}
                className="flex-1 border-[2px] border-black py-1 txt-move text-center bg-white hover:bg-gray-100 active:bg-gray-200 cursor-pointer font-[inherit]"
              >
                게임 다시하기
              </button>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border-[2px] border-black py-1 txt-move text-center bg-white hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
              >
                논문이 강한 이유는?
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
