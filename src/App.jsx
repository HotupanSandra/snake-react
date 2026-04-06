import { useCallback } from "react";
import { useSnake } from "./useSnake";

const CELL = 24;

export default function App() {
  const { snake, food, status, score, highScore, flash, grid, reset, setStatus, setDir } = useSnake();

  const handleStart = () => {
    if (status === "dead") {
      reset();
      setTimeout(() => setStatus("running"), 10);
    } else if (status === "idle" || status === "paused") {
      setStatus("running");
    } else {
      setStatus("paused");
    }
  };

  const handleDirBtn = useCallback((d) => {
    const dirs = {
      up:    { x: 0,  y: -1 },
      down:  { x: 0,  y:  1 },
      left:  { x: -1, y:  0 },
      right: { x: 1,  y:  0 },
    };
    if (status === "idle") setStatus("running");
    setDir(dirs[d]);
  }, [status, setStatus, setDir]);

  const boardSize = CELL * grid;

  return (
      <div className="min-h-screen bg-terminal flex flex-col items-center justify-center p-4 animate-flicker">

        <div className="mb-4 text-center">
          <h1 className="font-display text-phosphor text-6xl tracking-widest"
              style={{ textShadow: "0 0 10px #39ff14, 0 0 30px #39ff1466" }}>
            SNAKE
          </h1>
          <div className="flex gap-8 justify-center mt-1">
          <span className="font-mono text-phosphor-dim text-xs tracking-widest">
            SCORE: <span className="text-phosphor">{String(score).padStart(4, "0")}</span>
          </span>
            <span className="font-mono text-phosphor-dim text-xs tracking-widest">
            BEST: <span className="text-phosphor">{String(highScore).padStart(4, "0")}</span>
          </span>
          </div>
        </div>

        <div
            className={`relative crt rounded-sm border ${flash ? "border-amber" : "border-phosphor-dim"} transition-colors duration-100`}
            style={{
              width: boardSize,
              height: boardSize,
              background: "#050a05",
              boxShadow: flash
                  ? "0 0 20px #ffb700, 0 0 40px #ffb70044, inset 0 0 30px rgba(0,0,0,0.5)"
                  : "0 0 20px #39ff1422, 0 0 60px #39ff1411, inset 0 0 30px rgba(0,0,0,0.5)",
            }}
        >
          <svg className="absolute inset-0 opacity-10" width={boardSize} height={boardSize}>
            {Array.from({ length: grid }).map((_, row) =>
                Array.from({ length: grid }).map((_, col) => (
                    <circle
                        key={`${row}-${col}`}
                        cx={col * CELL + CELL / 2}
                        cy={row * CELL + CELL / 2}
                        r="1"
                        fill="#39ff14"
                    />
                ))
            )}
          </svg>

          <div
              className="absolute food-cell rounded-sm"
              style={{
                width: CELL - 4, height: CELL - 4,
                left: food.x * CELL + 2, top: food.y * CELL + 2,
                background: "#ffb700",
              }}
          />

          {snake.map((seg, i) => {
            const isHead = i === 0;
            return (
                <div
                    key={`${seg.x}-${seg.y}-${i}`}
                    className={`absolute rounded-sm ${isHead ? "snake-head" : "snake-body"}`}
                    style={{
                      width: isHead ? CELL - 2 : CELL - 4,
                      height: isHead ? CELL - 2 : CELL - 4,
                      left: seg.x * CELL + (isHead ? 1 : 2),
                      top: seg.y * CELL + (isHead ? 1 : 2),
                      background: isHead
                          ? "#39ff14"
                          : `rgba(57, 255, 20, ${Math.max(0.25, 1 - i * 0.03)})`,
                      zIndex: snake.length - i,
                    }}
                />
            );
          })}

          {status !== "running" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20 rounded-sm">
                {status === "dead" && (
                    <>
                      <p className="font-display text-danger text-4xl mb-1"
                         style={{ textShadow: "0 0 10px #ff4444" }}>GAME OVER</p>
                      <p className="font-mono text-phosphor-dim text-xs mb-6">SCORE: {score}</p>
                    </>
                )}
                {status === "paused" && (
                    <p className="font-display text-amber text-4xl mb-6 animate-blink"
                       style={{ textShadow: "0 0 10px #ffb700" }}>PAUSED</p>
                )}
                {status === "idle" && (
                    <p className="font-mono text-phosphor-dim text-xs mb-6 text-center px-4">
                      USE ARROW KEYS OR WASD<br />TO CONTROL THE SNAKE
                    </p>
                )}
                <button
                    onClick={handleStart}
                    className="font-display text-terminal bg-phosphor px-8 py-2 text-2xl hover:bg-phosphor-glow active:scale-95 transition-all"
                    style={{ boxShadow: "0 0 12px #39ff14" }}
                >
                  {status === "dead" ? "RETRY" : status === "paused" ? "RESUME" : "START"}
                </button>
                <p className="font-mono text-phosphor-dim text-xs mt-3 opacity-60">PRESS SPACE / ENTER</p>
              </div>
          )}
        </div>

        <div className="mt-6 grid grid-rows-3 grid-cols-3 gap-1 w-32">
          <div />
          <DPadBtn label="▲" onClick={() => handleDirBtn("up")} />
          <div />
          <DPadBtn label="◄" onClick={() => handleDirBtn("left")} />
          <button
              onClick={handleStart}
              className="font-mono text-xs text-terminal bg-phosphor-dim hover:bg-phosphor active:scale-95 rounded transition-all flex items-center justify-center"
              style={{ aspectRatio: "1" }}
          >
            {status === "running" ? "II" : "▶"}
          </button>
          <DPadBtn label="►" onClick={() => handleDirBtn("right")} />
          <div />
          <DPadBtn label="▼" onClick={() => handleDirBtn("down")} />
          <div />
        </div>

        <p className="mt-4 font-mono text-phosphor-dim text-xs opacity-40 tracking-widest">
          SPACE TO PAUSE · WASD / ↑↓←→
        </p>
      </div>
  );
}

function DPadBtn({ label, onClick }) {
  return (
      <button
          onClick={onClick}
          className="font-mono text-phosphor bg-transparent border border-phosphor-dim hover:border-phosphor hover:text-phosphor-glow active:scale-95 rounded text-sm transition-all flex items-center justify-center"
          style={{ aspectRatio: "1" }}
      >
        {label}
      </button>
  );
}