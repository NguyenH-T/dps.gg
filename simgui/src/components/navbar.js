import './navbar.css'
import { Link, Outlet, useLocation } from 'react-router-dom';


export default function Navbar() {
    const location = useLocation()
    return (
        <>
            <div className='container'>
                <ul className='NavBar'>
                    <li className="NavButtonLogo">
                        <Link to="/" style={{fontWeight: "600", fontSize: "20px"}}>
                            DPS.GG
                        </Link>
                    </li>
                    <li className="NavButton" style={location.pathname === "/simulator" ? { borderBottom: "1px solid var(--font-color)" } : {}}>
                        <Link to="/simulator"> 
                            Simulator
                        </Link>
                    </li>
                    <li className="NavButton" style={location.pathname === "/loadout" ? { borderBottom: "1px solid var(--font-color)" } : {}}>
                        <Link to="/loadout">
                            Loadout
                        </Link>
                    </li>
                </ul>
            </div>
            <Outlet />
        </>
    );
}