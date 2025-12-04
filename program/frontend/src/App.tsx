import { Routes, Route, Outlet } from "react-router-dom";
import Notes from "./pages/Notes";

import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar/>
      <main className="flex px-2 my-20 md:max-h-[calc(100vh-10rem)] justify-center items-center">
        <Routes>
          <Route path="/" element={<Notes />}>
          </Route>
        </Routes>
        <Outlet />
      </main>
    </div>
  );
}
