import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import StoryReviews from "./storyReviews";

function StoryPage() {
    const { id } = useParams(); // Grabs ID from URL
    const [story, setStory] = useState(null);
    const [chapterDetails, setChapterDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStory = async () => {
            const response = await fetch(`http://localhost:4000/api/stories/${id}`);
            const data = await response.json();
            setStory(data);
        };

        fetchStory();
    }, [id]);

    useEffect(() => {
        const fetchChapterDetails = async () => {
            if (story && story.chapters) {
                const details = {};
                for (const chapter_ID of story.chapters) {
                    const response = await fetch(`http://localhost:4000/api/chapters/${chapter_ID}`);
                    if (response.ok) {
                        const data = await response.json();
                        details[chapter_ID] = data;
                    }
                }
                setChapterDetails(details);
            }
        };
        fetchChapterDetails();
    }, [story]);

    if (!story) {
        return <div>Loading...</div>;
    }

    const AddToLib = async (storyId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/users/add-to-library/${storyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (response.ok) {
                setStory(prevStory => ({
                    ...prevStory,
                    collections: prevStory.collections + 1,
                    libraryReaders: [...(prevStory.libraryReaders || []), getUserId()]
                }));
                alert('Story added to your library!');
            } else {
                alert('Failed to add story to library.');
            }
        } catch (error) {
            console.error('Error adding story to library:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    const getChapterDetails = (chapter_ID) => {
        return chapterDetails[chapter_ID] || {};
    };


    const removeFromLibrary = async (storyId) => {
        const response = await fetch(`http://localhost:4000/api/users/remove-from-library/${storyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            setStory(prevStory => ({
                ...prevStory,
                collections: Math.max(prevStory.collections - 1, 0),
                libraryReaders: prevStory.libraryReaders.filter(id => id !== getUserId())
            }));
            alert('Story removed from your library!');
        } else {
            alert('Failed to remove story from library.');
        }
    };

    const getUserId = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.id; // assuming your token payload has { id, username, ... }
        } catch {
            return null;
        }
    };


    const isInLibrary = () => {
        const userId = getUserId();
        if (!userId) return false;
        return story.libraryReaders && story.libraryReaders.includes(userId);
    };

    return (
        <div>
            <h1>{story.title}</h1>
            <p>{story.description}</p>
            <p><strong>Author:</strong> {story.author?.username || "Unknown"}</p>
            <p><strong>Genre:</strong> {story.genre}</p>
            <p><strong>Collections:</strong> {story.collections}</p>
            <p><strong>Chapters:</strong> {story.chapters.length}</p>

            {/* Add to library button or remove from library button */}
            {isInLibrary() ? (
                <button onClick={() => removeFromLibrary(story._id)}>Remove from library</button>
                // Page should refresh itself to reflect changes

            ) : (
                <button onClick={() => AddToLib(story._id)}>Add to library</button>
            )}
            <button onClick={() => window.location.href = '/'}>Go to Home</button>

            <h2>Chapters</h2>
            <ul>
                {story.chapters.map((chapter_ID, index) => {
                    const chapter = getChapterDetails(chapter_ID);

                    if (!chapter.isPublished) return null; // Skip drafts entirely

                    return (
                        <li
                            key={chapter_ID}
                            style={{
                                border: "1px solid #ddd",
                                margin: "8px 0",
                                padding: "8px",
                                borderRadius: "8px",
                            }}
                        >
                            <h4
                                onClick={() => navigate(`/chapters/${chapter_ID}`)}
                                style={{ cursor: "pointer" }}
                            >
                                {chapter.title}
                            </h4>
                            <p>
                                <em>
                                    Created: {new Date(chapter.createdAt).toLocaleString()}
                                </em>
                            </p>
                        </li>
                    );
                })}
            </ul>
            <StoryReviews storyId={story._id} />
            
        </div>
    );
}
export default StoryPage;
