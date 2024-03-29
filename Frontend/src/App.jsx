import { BrowserRouter, Routes, Route } from "react-router-dom";
import Project from "./pages/Project";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
