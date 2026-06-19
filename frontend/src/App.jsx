import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Products from "./pages/products";
import Compare from "./pages/compare";
import Wizard from "./pages/wizard";
import Assistant from "./pages/assistant";
import Admin from "./pages/admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/recommend" element={<Wizard />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/admin/products" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;