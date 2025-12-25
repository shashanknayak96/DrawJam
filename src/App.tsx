import { useEffect, useRef, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import type { StrokeData } from "./models/StrokeData";

function App() {
  const timeoutRef = useRef<number | null>(null);
  const [strokes, setStrokes] = useState<StrokeData[]>(() => {
    const storedPoints = localStorage.getItem("drawjam-points");
    return storedPoints ? JSON.parse(storedPoints) : [];
  });
  const [activeColor, setActiveColor] = useState<string>("#000");

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
  };

  const saveToLocalStorage = (data: StrokeData[]) => {
    localStorage.setItem("drawjam-points", JSON.stringify(data));
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      saveToLocalStorage(strokes);
      console.log("Saved!");
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [strokes]);

  return (
    <div className="h-screen flex flex-col">
      <Header></Header>

      <div className="flex-1 relative">
        <Canvas
          strokes={strokes}
          setStrokes={setStrokes}
          activeColor={activeColor}
        ></Canvas>
        <Toolbar
          handleClear={handleClear}
          handleUndo={handleUndo}
          setActiveColor={setActiveColor}
        ></Toolbar>
      </div>
    </div>
  );
}

export default App;
