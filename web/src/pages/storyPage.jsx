import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import StoryReviewsView from "../components/StoryReviewsViews";
import StoryPageView from "../components/StoryPageView";
import { API_BASE } from "../config";


function StoryPage() {
    const { id } = useParams(); // Grabs ID from URL
    const [story, setStory] = useState(null);
    const [chapterDetails, setChapterDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStory = async () => {
            const response = await fetch(`${API_BASE}/api/stories/${id}`);
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
                    const response = await fetch(`${API_BASE}/api/chapters/${chapter_ID}`);
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
            const response = await fetch(`${API_BASE}/api/users/add-to-library/${storyId}`, {
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
        const response = await fetch(`${API_BASE}/api/users/remove-from-library/${storyId}`, {
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

    const goHome = () => {
        navigate("/");
    };

    return (
    <StoryPageView
        story={story}
        chapterDetails={chapterDetails}
        isInLibrary={isInLibrary()}
        onAddToLibrary={() => AddToLib(story._id)}
        onRemoveFromLibrary={() => removeFromLibrary(story._id)}
        onChapterClick={(chapter_ID) => navigate(`/chapters/${chapter_ID}`)}
        onBackHome={goHome}
        reviewsComponent={<StoryReviewsView storyId={story._id} />}
    />

    );
}
export default StoryPage;
