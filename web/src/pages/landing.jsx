import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import Navbar from "../components/Navbar";
import StoriesGrid from "../components/StoriesGrid";

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
        const response = await fetch(`${API_BASE}/api/stories/all`);
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
        <>
            <Navbar isLoggedIn={isloggedIn} username={username} />
            <StoriesGrid stories={stories} />
        </>
    );
}

export default LandingPage;