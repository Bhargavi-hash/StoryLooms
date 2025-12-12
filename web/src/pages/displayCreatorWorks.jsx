import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import CreatorStoryCard from "../components/CreatorStoryCard";

function DisplayCreatorWorks() {
    const [stories, setStories] = useState([]);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");

    const navigate = useNavigate();
    useEffect(() => {
        // Fetch and display the creator's works
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/stories/creator-works/${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch stories");
                }
                const data = await response.json();
                setStories(data);
                // console.log("Creator works data:", data);
            } catch (error) {
                console.error("Error fetching creator works:", error);
            }
        };

        if (username) { fetchData(); }
    }, [username]);

    const handleDelete = async (storyId) => {
        try {
            const response = await fetch(`${API_BASE}/api/stories/${storyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                setStories(stories.filter(story => story._id !== storyId));
            } else {
                console.error("Failed to delete story");
            }
        } catch (error) {
            console.error("Error deleting story:", error);
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "20px",
            maxWidth: "800px",
            margin: "0 auto"
        }}>
            <h1 style={{ textAlign: "center", color: "#2AAA8A" }}>{username}'s Works</h1>
            {/* Create new story button */}
            <button
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#2AAA8A",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    alignSelf: "center",
                    marginBottom: "20px"
                }}
                onClick={() => navigate("/create-story")}
            >
                Create New Story
            </button>
            {stories.length > 0 ? (
                stories.map((story) => (
                    <CreatorStoryCard
                        key={story._id}
                        story={story}
                        onDelete={handleDelete}
                    />
                ))
            ) : (
                <p>No stories found for this author.</p>
            )}
        </div>

    );
}
export default DisplayCreatorWorks;