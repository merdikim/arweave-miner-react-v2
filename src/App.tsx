import Navbar from "@/components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/pages/Home";
import NotFound from "@/components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="*" element={<NotFound msg="Page not found" />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
