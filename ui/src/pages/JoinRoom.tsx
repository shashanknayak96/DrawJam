import { useEffect, useState } from "react";
import { getSocket } from "../socket";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!username) return;
    getSocket().emit("create-room", { username });
  };

  const handleJoinRoom = () => {
    if (!username || !roomId) return;
    getSocket().emit("join-room", { roomId, username });
  };

  useEffect(() => {
    const socket = getSocket();

    const handleRoomCreated = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`, { state: { username } });
    };

    const handleJoinSuccess = ({ roomId }: { roomId: string }) => {
      console.log("Join success");
      navigate(`/room/${roomId}`, { state: { username } });
    };

    const handleJoinError = (message: string) => {
      alert(message);
    };

    socket.on("room-created", handleRoomCreated);
    socket.on("join-success", handleJoinSuccess);
    socket.on("join-error", handleJoinError);

    return () => {
      socket.off("room-created", handleRoomCreated);
      socket.off("join-success", handleJoinSuccess);
      socket.off("join-error", handleJoinError);
    };
  }, [navigate, username]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-gray-950">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-800 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white">
          🎨 DrawJam
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Jump into a shared canvas instantly
        </p>

        <div className="mt-8 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Your name
            </label>
            <input
              type="text"
              placeholder="e.g. Shashank"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Room ID */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Room ID
            </label>
            <input
              type="text"
              placeholder="Enter room code"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleCreateRoom()}
              disabled={!username}
              className="flex-1 rounded-lg border border-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:border-indigo-500 hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Create Room
            </button>

            <button
              onClick={() => handleJoinRoom()}
              disabled={!username || !roomId}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Join Room →
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          No login • No history • Just draw
        </p>
      </div>
    </div>
  );
}
