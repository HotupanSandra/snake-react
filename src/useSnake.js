import { useState, useEffect, useCallback, useRef } from "react";

const GRID = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;

function randomCell(snake) {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
        };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
}

const INITIAL_SNAKE = [
    { x: 10, y: 10 },
    { x: 9,  y: 10 },
    { x: 8,  y: 10 },
];

export function useSnake() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [dir, setDir] = useState({ x: 1, y: 0 });
    const [food, setFood] = useState({ x: 15, y: 10 });
    const [status, setStatus] = useState("idle");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() =>
        parseInt(localStorage.getItem("snake-hs") || "0")
    );
    const [flash, setFlash] = useState(false);

    const dirRef = useRef(dir);
    const snakeRef = useRef(snake);
    const foodRef = useRef(food);
    const statusRef = useRef(status);
    const scoreRef = useRef(score);

    dirRef.current = dir;
    snakeRef.current = snake;
    foodRef.current = food;
    statusRef.current = status;
    scoreRef.current = score;

    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - score * 3);

    const reset = useCallback(() => {
        setSnake(INITIAL_SNAKE);
        setDir({ x: 1, y: 0 });
        setFood(randomCell(INITIAL_SNAKE));
        setScore(0);
        setStatus("idle");
        setFlash(false);
    }, []);

    const tick = useCallback(() => {
        if (statusRef.current !== "running") return;
        const d = dirRef.current;
        const s = snakeRef.current;
        const head = { x: s[0].x + d.x, y: s[0].y + d.y };

        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
            setStatus("dead");
            return;
        }
        if (s.some((seg) => seg.x === head.x && seg.y === head.y)) {
            setStatus("dead");
            return;
        }

        const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
        const newSnake = ate ? [head, ...s] : [head, ...s.slice(0, -1)];

        if (ate) {
            const newScore = scoreRef.current + 1;
            setScore(newScore);
            if (newScore > parseInt(localStorage.getItem("snake-hs") || "0")) {
                localStorage.setItem("snake-hs", newScore);
                setHighScore(newScore);
            }
            setFood(randomCell(newSnake));
            setFlash(true);
            setTimeout(() => setFlash(false), 150);
        }

        setSnake(newSnake);
    }, []);

    useEffect(() => {
        if (status !== "running") return;
        const id = setInterval(tick, speed);
        return () => clearInterval(id);
    }, [status, tick, speed]);

    useEffect(() => {
        const onKey = (e) => {
            const map = {
                ArrowUp:    { x: 0,  y: -1 },
                ArrowDown:  { x: 0,  y:  1 },
                ArrowLeft:  { x: -1, y:  0 },
                ArrowRight: { x: 1,  y:  0 },
                w: { x: 0,  y: -1 },
                s: { x: 0,  y:  1 },
                a: { x: -1, y:  0 },
                d: { x: 1,  y:  0 },
            };

            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                if (statusRef.current === "idle" || statusRef.current === "dead") {
                    if (statusRef.current === "dead") reset();
                    setTimeout(() => setStatus("running"), 10);
                } else if (statusRef.current === "running") {
                    setStatus("paused");
                } else if (statusRef.current === "paused") {
                    setStatus("running");
                }
                return;
            }

            const newDir = map[e.key];
            if (!newDir) return;
            e.preventDefault();

            const cur = dirRef.current;
            if (newDir.x === -cur.x && newDir.y === -cur.y) return;
            if (statusRef.current === "idle") setStatus("running");
            setDir(newDir);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [reset]);

    return { snake, food, status, score, highScore, flash, grid: GRID, reset, setStatus, setDir };
}