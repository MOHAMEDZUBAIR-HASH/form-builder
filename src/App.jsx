import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adminpage from "./page/Adminpage";
import Userpage from "./components/Userpage";
import ViewResponses from "./components/ViewResponses";
import Land from "./components/Land";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Land />} />
        <Route path="/adminpage" element={<Adminpage />} />
        <Route path="/userpage/*" element={<Userpage />} />
        <Route path="/viewresponses/*" element={<ViewResponses />} /> {/* 👈 new route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;


