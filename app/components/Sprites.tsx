const OAK_COLORS: Record<number, string> = {
  1: "#181818",
  2: "#909090", // gray hair
  3: "#f8c880", // skin
  4: "#f4f4ec", // lab coat
  5: "#282860", // dark pants
  6: "#c8c8c0", // coat shadow
};

// 12 wide × 22 tall
const OAK_PIXELS: number[][] = [
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
  [1, 2, 3, 1, 3, 3, 3, 1, 3, 3, 2, 1], // eyes
  [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
  [0, 1, 3, 3, 1, 3, 1, 3, 3, 3, 1, 0], // mouth
  [0, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0],
  [0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0], // collar
  [1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 1], // lapels
  [1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 1],
  [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
  [1, 4, 6, 4, 4, 4, 4, 4, 4, 6, 4, 1], // arms
  [1, 4, 6, 4, 4, 4, 4, 4, 4, 6, 4, 1],
  [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
  [0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0],
  [0, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0], // pants
  [0, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0],
  [0, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0],
  [0, 1, 5, 5, 1, 0, 0, 1, 5, 5, 1, 0], // legs
  [0, 1, 5, 5, 1, 0, 0, 1, 5, 5, 1, 0],
  [0, 1, 5, 5, 1, 0, 0, 1, 5, 5, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0], // feet
];

const PLAYER_COLORS: Record<number, string> = {
  1: "#181818",
  2: "#101028", // dark cap
  3: "#f8c880", // skin
  4: "#3050b0", // blue straps
  5: "#202028", // dark jacket
  6: "#6068b0", // backpack
  7: "#404888", // backpack detail
};

// 12 wide × 21 tall
const PLAYER_PIXELS: number[][] = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // cap top
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0], // brim
  [0, 0, 1, 3, 3, 3, 3, 3, 1, 0, 0, 0], // neck
  [0, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0], // jacket
  [1, 5, 4, 4, 5, 5, 5, 5, 4, 4, 5, 1], // straps
  [1, 5, 4, 6, 6, 6, 6, 6, 6, 4, 5, 1],
  [1, 5, 4, 6, 6, 6, 6, 6, 6, 4, 5, 1],
  [1, 5, 4, 6, 7, 6, 6, 7, 6, 4, 5, 1], // backpack detail
  [1, 5, 4, 6, 6, 6, 6, 6, 6, 4, 5, 1],
  [1, 5, 4, 6, 6, 6, 6, 6, 6, 4, 5, 1],
  [1, 5, 4, 4, 6, 6, 6, 6, 4, 4, 5, 1],
  [0, 1, 5, 4, 4, 4, 4, 4, 4, 5, 1, 0],
  [0, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0], // lower jacket
  [0, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0],
  [0, 1, 5, 5, 1, 0, 0, 1, 5, 5, 1, 0], // legs
  [0, 1, 5, 5, 1, 0, 0, 1, 5, 5, 1, 0],
  [0, 1, 5, 5, 1, 0, 0, 1, 5, 5, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0], // feet
];

function PixelSprite({
  pixels,
  colors,
}: {
  pixels: number[][];
  colors: Record<number, string>;
}) {
  const h = pixels.length;
  const w = pixels[0].length;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ imageRendering: "pixelated" }}
    >
      {pixels.flatMap((row, y) =>
        row.map((c, x) =>
          c !== 0 ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={colors[c]}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function ProfOakSprite() {
  return <PixelSprite pixels={OAK_PIXELS} colors={OAK_COLORS} />;
}

export function PlayerSprite() {
  return <PixelSprite pixels={PLAYER_PIXELS} colors={PLAYER_COLORS} />;
}
