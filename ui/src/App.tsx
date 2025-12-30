import "./App.css";
import { Route, Routes } from "react-router-dom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";

function App() {
  return (
    <div className="w-screen h-screen">
      <Routes>
        <Route path="/" element={<JoinRoom />}></Route>
        <Route path="/room/:roomId" element={<Room />}></Route>
      </Routes>
    </div>
  );
}

export default App;
