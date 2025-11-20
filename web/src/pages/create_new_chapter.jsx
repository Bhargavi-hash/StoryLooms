import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CreateNewChapter() {
    const { id } = useParams(); // Story ID from URL
    const [story, setStory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStory = async () => {
            const response = await fetch(`http://localhost:4000/api/stories/${id}`);
            if (response.ok) {
                const data = await response.json();
                setStory(data);
            }
        };
        fetchStory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:4000/api/chapters/add/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                storyId: id,
                title: e.target.title.value,
                content: e.target.content.value,
                isPublished: e.target.isPublished.checked,
            }),
        });
        if (response.ok) {
            alert('Chapter created successfully');
            navigate(`/stories/author-view/${id}`);
        } else {
            alert('Failed to create chapter');
        }
    };

    return (
        <div>
            <h1>Create New Chapter for "{story ? story.title : 'Loading...'}"</h1>
            {story ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="title">Chapter Title:</label>
                        <input type="text" name="title" required />
                    </div>
                    <div>
                        <label htmlFor="content">Content:</label>
                        <textarea name="content" rows="10" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="isPublished">Publish:</label>
                        <input type="checkbox" name="isPublished" />
                    </div>
                    <button type="submit">Create</button>
                </form>
            ) : (
                <p>Loading story details...</p>
            )}
        </div>
    );  
}

export default CreateNewChapter;

