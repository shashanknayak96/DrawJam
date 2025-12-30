import { useNavigate, useParams } from "react-router-dom";
import User from "./User";
import { getSocket } from "../socket";
import { SocketEvent } from "../enums/SocketEvents";

type HeaderProps = {
  users: string[];
};

const MAX_VISIBLE_USERS = 4;

const Header = ({ users }: HeaderProps) => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const visibleUsers = users.slice(0, MAX_VISIBLE_USERS);
  const extraCount = users.length - MAX_VISIBLE_USERS;

  const handleLeaveButton = () => {
    const socket = getSocket();

    socket.emit(SocketEvent.LEAVE_SERVER, { roomId });
    navigate("/", { replace: true });
  };

  return (
    <header className="h-14 px-6 flex items-center justify-between bg-white/80 backdrop-blur border-b">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
          DJ
        </div>
        <span className="text-lg font-semibold tracking-tight">DrawJam</span>
      </div>

      {/* Room */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Room <span className="font-semibold">{roomId}</span>
      </div>

      {/* Presence + Action */}
      <div className="flex items-center gap-4">
        {/* Users */}
        <div className="flex items-center">
          {visibleUsers.map((user) => (
            <div key={user} className="-ml-2 first:ml-0">
              <User name={user} />
            </div>
          ))}

          {extraCount > 0 && (
            <div className="-ml-2 h-8 w-8 rounded-full bg-gray-200 text-xs font-semibold text-gray-700 flex items-center justify-center border">
              +{extraCount}
            </div>
          )}
        </div>

        {/* Leave */}
        <button
          className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition"
          onClick={() => handleLeaveButton()}
        >
          Leave
        </button>
      </div>
    </header>
  );
};

export default Header;
