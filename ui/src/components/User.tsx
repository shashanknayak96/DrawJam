const User = ({ name }: { name: string }) => {
  return (
    <div
      title={name}
      className="h-8 w-8 rounded-full bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center border-2 border-white"
    >
      {name[0].toUpperCase()}
    </div>
  );
};

export default User;
