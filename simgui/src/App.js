import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SimPage from './simPage.js';
import Menu from './Menu.js';
import Navbar from './components/navbar.js';
import Loadout from './Loadoutscreen.js';
import Data from './components/data.js';

function App(){
  return (
      <Data>
        <Router>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Menu />} />
              <Route exact path="/simulator" element={<SimPage />} />
              <Route exact path="/loadout" element={<Loadout />} />
            </Route>
          </Routes>
        </Router>
      </Data>
    );
  }
export default App;