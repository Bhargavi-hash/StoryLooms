import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StoryPageForAuthor() {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [chapterDetails, setChapterDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStory = async () => {
            const response = await fetch(`${API_BASE}/api/stories/${id}`);
            if (response.ok) {
                const data = await response.json();
                setStory(data);
            }
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

    const getChapterDetails = (chapter_ID) => {
        return chapterDetails[chapter_ID] || {};
    };

    const handleStoryEdit = (id) => {
        // Logic to handle story editing can be added here
        navigate(`/stories/edit/${id}`);
    }


    const ChapterDelete = async (chapter_ID) => {
        const response = await fetch(`${API_BASE}/api/chapters/${id}/${chapter_ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },

        });
        if (response.ok) {
            setStory((prevStory) => ({
                ...prevStory,
                chapters: prevStory.chapters.filter((id) => id !== chapter_ID),
            }));

            setChapterDetails((prevDetails) => {
                const updatedDetails = { ...prevDetails };
                delete updatedDetails[chapter_ID];
                return updatedDetails;
            });
        }
    };

    const handleChapterPublish = async (chapter_ID) => {
        const response = await fetch(`${API_BASE}/api/chapters/edit/${chapter_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ isPublished: true })
        });
        if (response.ok) {
            setChapterDetails((prevDetails) => ({
                ...prevDetails,
                [chapter_ID]: {
                    ...prevDetails[chapter_ID],
                    isPublished: true
                }
            }));
            alert('Chapter published successfully');
        } else {
            alert('Failed to publish chapter');
        }
    };

    const handleChapterUnpublish = async (chapter_ID) => {
        const response = await fetch(`${API_BASE}/api/chapters/edit/${chapter_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ isPublished: false })
        });
        if (response.ok) {
            setChapterDetails((prevDetails) => ({
                ...prevDetails,
                [chapter_ID]: {
                    ...prevDetails[chapter_ID],
                    isPublished: false
                }
            }));
            alert('Chapter unpublished successfully');
        } else {
            alert('Failed to unpublish chapter');
        }
    };

    const handleChapterDelete = (chapter_ID) => {
        ChapterDelete(chapter_ID);
    }

    return (
        <div>
            <h1>Story Management Page</h1>
            {story ? (
                <div>
                    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
                        <h2>{story.title}</h2>
                        <p>{story.description}</p>
                        <p><strong>Genre:</strong> {story.genre}</p>
                        <button onClick={() => handleStoryEdit(story._id)}>Edit Story Details</button>
                    </div>
                    <h3>Chapters:</h3>
                    <button onClick={() => navigate(`/stories/${story._id}/chapters/new`)}>Create new chapter</button>
                    {story.chapters && story.chapters.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {story.chapters.map((chapter_ID, index) => (
                                <li key={index}
                                    style={{ border: '1px solid #ddd', margin: '8px 0', padding: '8px', borderRadius: '8px' }}>
                                    <h4 onClick={() => navigate(`/chapters/edit/${chapter_ID}`)}>{getChapterDetails(chapter_ID).title}</h4>
                                    <p><em>Created: {new Date(getChapterDetails(chapter_ID).createdAt).toLocaleString()}</em></p>
                                    <p><em>Last Modified: {new Date(getChapterDetails(chapter_ID).updatedAt).toLocaleString()}</em></p>
                                    <p><em>{getChapterDetails(chapter_ID).isPublished ? "Published" : "Draft"}</em></p>
                                    {getChapterDetails(chapter_ID).isPublished ? (
                                        <button onClick={() => handleChapterUnpublish(chapter_ID)}>Unpublish</button>
                                    ) : (
                                        <button onClick={() => handleChapterPublish(chapter_ID)}>Publish</button>
                                    )}
                                    <button onClick={() => handleChapterDelete(chapter_ID)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No chapters available.</p>
                    )}
                </div>
            ) : (
                <p>Loading story...</p>
            )}
            <button onClick={() => window.location.href = '/'}>Go to Home</button>
            {/* Additional author-specific functionalities can be added here */}
        </div>
    );
}
export default StoryPageForAuthor;