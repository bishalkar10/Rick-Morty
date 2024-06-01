import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/Navbar";
import Characters from "./pages/Characters";
import Episodes from "./pages/Episodes";
import Locations from "./pages/Locations";
import CharacterProfile from "./pages/CharacterProfile";
import EpisodeProfile from "./pages/EpisodeProfile";
import LocationProfile from "./pages/LocationProfile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/episodes" element={<Episodes />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/characters/:id" element={<CharacterProfile />} />
        <Route path="/episodes/:id" element={<EpisodeProfile />} />
        <Route path="/locations/:id" element={<LocationProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
