import { useEffect, useRef, useState } from "react";
import type { StrokePoint, StrokeData } from "../models/StrokeData";

interface CanvasProp {
  strokes: StrokeData[];
  setStrokes: (
    strokes: StrokeData[] | ((prev: StrokeData[]) => StrokeData[])
  ) => void;
  activeColor: string;
  onStrokeComplete: (stroke: StrokeData) => void;
}

const Canvas = ({
  strokes,
  setStrokes,
  activeColor,
  onStrokeComplete,
}: CanvasProp) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStrokes, setCurrentStrokes] = useState<StrokePoint[]>([]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    // Store to strokes
    setStrokes((prev: StrokeData[]) => {
      const currentStroke = {
        id: Date.now(),
        color: activeColor,
        width: 1,
        points: currentStrokes,
      };
      const updated = [...prev, currentStroke];

      onStrokeComplete(currentStroke);
      return updated;
    });
    setCurrentStrokes([]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    lastPoint.current = getMousePos(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const currentPos = getMousePos(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.strokeStyle = activeColor;
    ctx.stroke();

    // While mouse is moving, add to currentStrokes
    setCurrentStrokes((prev) => [...prev, currentPos]);

    lastPoint.current = currentPos;
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    // Set canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.lineCap = "square";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    // Redraw canvas from strokes
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      // TODO: set color, width
      ctx.beginPath();
      stroke.points.forEach((point, index) => {
        // Draw
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.strokeStyle = stroke.color;
      ctx.stroke();
    });
  }, [strokes]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <canvas
        ref={canvasRef}
        className="w-full max-w-5xl h-full max-h-[80vh] m-6 bg-white border-2 border-gray-200 rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default Canvas;
