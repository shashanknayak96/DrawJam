const Header = () => {
  return (
    <header className="h-14 px-6 flex items-center justify-between bg-white/80 backdrop-blur">
      {/* Name */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
          DJ
        </div>
        <span className="text-lg font-semibold tracking-tight">DrawJam</span>
      </div>

      {/* Room name */}
      <div className="sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
        Room: <span className="font-semibold">alpha-123</span>
      </div>

      {/* Leave button */}
      <button className="px-4 py-1.5 rounded-md text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition cursor-pointer">
        Leave Room
      </button>
    </header>
  );
};

export default Header;
