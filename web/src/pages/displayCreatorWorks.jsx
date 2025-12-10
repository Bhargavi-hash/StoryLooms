import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        <div>
            <h1>{username ? `${username}'s Stories` : "All the author stories will be displayed here"}</h1>
            <button onClick={() => navigate('/create-story')}>Create New Story</button>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {stories.length > 0 ? (
                    stories.map((story) => (
                        <div
                            key={story._id}
                            onClick={() => navigate(`/stories/author-view/${story._id}`)}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "1rem",
                                width: "250px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h3>{story.title}</h3>
                            <p>{story.description?.substring(0, 100)}...</p>
                            <p><strong>Genre:</strong> {story.genre}</p>
                            <small>Created on {new Date(story.createdAt).toLocaleDateString()}</small>
                            <br></br>
                            <button onClick={(e) => {e.stopPropagation(); handleDelete(story._id)}}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No stories found for this author.</p>
                )}
            </div>
            <button onClick={() => window.location.href = '/'}>Go to Home</button>
        </div>
    );
}
export default DisplayCreatorWorks;