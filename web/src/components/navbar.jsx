import { Link, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  let username = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;  // MUST be inside your token payload
    } catch {
      console.log("Invalid token");
    }
  }

  // Hide navbar on Login and Register pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  if (hideNavbar) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">StoryLoom</Link>
      </div>

      <div className="nav-right">
        {username && (
          <Link to={`/creator-works/${username}`}>My Stories</Link>
        )}
        {/* <Link to="/library">Library</Link>
        <Link to="/profile">Profile</Link> */}
      </div>
    </nav>
  );
}
