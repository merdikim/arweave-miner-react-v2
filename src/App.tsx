import Navbar from "@/components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
