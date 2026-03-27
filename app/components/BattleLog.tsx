"use client";

import { useEffect, useState, type RefObject } from "react";

const DEFAULT_CHAR_DELAY_MS = 40;

type BattleLogProps = {
  logRef: RefObject<HTMLDivElement | null>;
  currentLine: string | null;
  emptyMessage: string;
  hasMore?: boolean;
  charDelayMs?: number;
};

export function BattleLog({ logRef, currentLine, emptyMessage, hasMore, charDelayMs = DEFAULT_CHAR_DELAY_MS }: BattleLogProps) {
  const fullText = currentLine ?? emptyMessage;
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, charDelayMs);
    return () => clearInterval(id);
  }, [fullText]);

  const isTyping = displayed.length < fullText.length;

  return (
    <div
      ref={logRef}
      className="border-t-[2px] border-black bg-white px-3 py-2 h-full flex items-start"
    >
      <div className="w-full">
        <p className="txt-log leading-[1.8] m-0 whitespace-pre-wrap">{displayed}</p>
        {!isTyping && hasMore && (
          <div className="text-right txt-log leading-none mt-0.5 animate-bounce">▼</div>
        )}
      </div>
    </div>
  );
}
