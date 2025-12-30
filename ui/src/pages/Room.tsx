import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";
import Header from "../components/Header";
import Toolbar from "../components/Toolbar";
import type { StrokeData } from "../models/StrokeData";
import { useParams } from "react-router-dom";
import { getSocket } from "../socket";
import { SocketEvent } from "../enums/SocketEvents";

function Room() {
  const timeoutRef = useRef<number | null>(null);
  const [strokes, setStrokes] = useState<StrokeData[]>(() => {
    const storedPoints = localStorage.getItem("drawjam-points");
    return storedPoints ? JSON.parse(storedPoints) : [];
  });
  const [activeColor, setActiveColor] = useState<string>("#000");
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();
  const socket = getSocket();

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    socket.emit(SocketEvent.CLEAR_CANVAS, { roomId });
  };

  const saveToLocalStorage = (data: StrokeData[]) => {
    localStorage.setItem("drawjam-points", JSON.stringify(data));
  };

  const sendStroke = (stroke: StrokeData) => {
    socket.emit(SocketEvent.DRAW_STROKE, {
      roomId,
      stroke,
    });
  };

  // Debounced save to localstorage
  useEffect(() => {
    // TODO: Check if value didnt change dont trigger a localstorage save
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
  }, [strokes, roomId]);

  // Get strokes
  useEffect(() => {
    const handleGetStrokes = ({ strokes }: { strokes: StrokeData[] }) => {
      console.log("handleGetStrokes");
      setStrokes(strokes);
    };

    const handleReceiveStroke = ({ stroke }: { stroke: StrokeData }) => {
      console.log("handleReceiveStroke");
      setStrokes((prev) => [...prev, stroke]);
    };

    const handleClearCanvas = () => {
      setStrokes([]);
    };

    const handleRoomUsersUpdate = ({ users }: { users: [] }) => {
      setUsers(users);
      console.log("USERS:", users);
    };

    socket.emit("get-room-state", { roomId });

    socket.on("room-state", handleGetStrokes);
    socket.on(SocketEvent.RECEIVE_STROKE, handleReceiveStroke);
    socket.on(SocketEvent.CLEAR_CANVAS, handleClearCanvas);
    socket.on(SocketEvent.ROOM_USERS_UPDATE, handleRoomUsersUpdate);

    return () => {
      socket.off("room-state", handleGetStrokes);
      socket.off(SocketEvent.RECEIVE_STROKE, handleReceiveStroke);
      socket.off(SocketEvent.CLEAR_CANVAS, handleClearCanvas);
      socket.off(SocketEvent.ROOM_USERS_UPDATE, handleRoomUsersUpdate);
    };
  }, [roomId, socket]);

  return (
    <div className="flex flex-col">
      <Header users={users}></Header>

      <div className="flex-1 relative">
        <Canvas
          strokes={strokes}
          setStrokes={setStrokes}
          activeColor={activeColor}
          onStrokeComplete={sendStroke}
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

export default Room;
