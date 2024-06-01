import { Link } from "react-router-dom";

export default function Navbar() {
  return <header>
    <h1>Rick and Morty</h1>

    <nav>
      <ul>
      <li><Link to={"/characters"}>Characters</Link></li>
      <li><Link to={"/episodes"}>Episodes</Link></li>
      <li> <Link to={"/locations"}>Locations</Link></li>
      </ul>
    </nav>
  </header>;
}
