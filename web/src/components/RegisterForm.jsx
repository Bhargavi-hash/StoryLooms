import "../styles/Register.css";

function RegisterForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
}) {
  return (
    <div className="register-container">
      <div className="register-card">
        <img src="/storyloomlogo.png" className="register-logo" />
        <br></br>
        <img 
          src="/storyloom-navbar.png"      // <-- drop a logo inside public/logo.png
          alt="StoryLoom Logo"
          className="storynavbar-logo"
        />

        <h1 className="register-title">Create your account</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="username">Username*:</label>
            <input
              type="text"
              className="register-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">Email*:</label>
            <input
              type="email"
              className="register-input"
              placeholder="email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">Password*:</label>
            <input
              type="password"
              className="register-input"
              placeholder="Choose password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="register-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
