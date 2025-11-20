import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const [isloggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [stories, setStories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a JWT token exists in local storage
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        if (token) {
            setIsLoggedIn(true);
            setUsername(username || "User");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername("");
        alert("Logged out successfully");
    }

    const displayStories = async () => {
        // Logic to display stories can be added here
        const response = await fetch(`http://localhost:4000/api/stories/all`);
        if (!response.ok) {
            throw new Error("Failed to fetch stories");
        }
        const data = await response.json();
        setStories(data);
    }
    useEffect(() => {
        displayStories();
    }, []);

    return (
        <div>
            <h1>Welcome to StoryLoom</h1>
            <p>This is the starting point of our web application.</p>

            {isloggedIn ? (
                <div>
                    <h2>You are logged in!</h2>
                    <p>Hi {username}!</p>
                    {/* <p>Stories will be displayed here!</p> */}
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={() => navigate('/library')}>Library</button>
                    <button onClick={() => navigate(`/creator-works/${username}`)}>My Stories</button>
                    
                </div>
            ) : (
                <div>
                    <h2>You are not logged in.</h2>
                    <p>Please log in to see your stories.</p>
                    <a href="/login">Go to Login Page</a>
                    <br />
                    <a href="/register">Go to Registration Page</a>
                </div>
            )}
            <div>
                {stories.map((story) => (
                    <div key={story._id}
                        style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', margin: '16px 0' }}>
                        {/* Clicking on the title will take you to the story page */}
                        <h3 onClick={() => navigate(`/stories/${story._id}`)}>{story.title}</h3>
                        <p>{story.collections} collections</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPage;