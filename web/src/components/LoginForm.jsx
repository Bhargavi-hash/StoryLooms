import "../styles/Login.css";

function LoginForm({ username, password, setUsername, setPassword, handleSubmit }) {
  return (
    <div className="login-container">
      <div className="login-card">
        
        <img 
          src="../../storyloomlogo.png"      // <-- drop a logo inside public/logo.png
          alt="StoryLoom Logo"
          className="login-logo"
        />
        <br></br>
        <img 
          src="../../storyloom-navbar.png"      // <-- drop a logo inside public/logo.png
          alt="StoryLoom Logo"
          className="storynavbar-logo"
        />
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username*:</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <label htmlFor="password">Password*:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
