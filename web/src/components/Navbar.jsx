import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, username }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src="/storyloom-navbar.png" className="nav-logo" alt="StoryLoom" />
      </div>

      {/* Center: Search */}
      <div className="nav-center">
        <input 
          type="text" 
          placeholder="Search stories..."
          className="nav-search"
        />
      </div>

      {/* Right: Menu */}
      <div className="nav-right">
        {isLoggedIn ? (
          <>
            <button className="nav-btn" onClick={() => navigate("/library")}>
              Library
            </button>
            <button className="nav-btn" onClick={() => navigate(`/creator-works/${username}`)}>
              Create
            </button>
            <div className="nav-profile" onClick={() => navigate("/profile")}>
              {username[0]?.toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="nav-btn" onClick={() => navigate("/register")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}

