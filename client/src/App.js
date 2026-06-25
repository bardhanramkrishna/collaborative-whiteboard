import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage      from "./pages/HomePage";
import WhiteboardPage from "./pages/Whiteboard/WhiteboardPage";
import Analytics     from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/board/:roomId" element={<WhiteboardPage />} />
        <Route path="/analytics"  element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;