import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditStoryDetails() {
    const { id } = useParams();
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
        const response = await fetch(`http://localhost:4000/api/stories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: e.target.title.value,
                description: e.target.description.value,
                genre: e.target.genre.value,
            }),
        });
        if (response.ok) {
            alert('Story updated successfully');
            navigate(`/stories/author-view/${id}`);
        } else {
            alert('Failed to update story');
        }
    };

    return (
        <div>
            <h1>Edit Story Details</h1>
            {/* Form for editing story details goes here */}
            {story ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input type="text" name="title" defaultValue={story.title} required />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea name="description" defaultValue={story.description} required></textarea>
                    </div>
                    <div>
                        <label htmlFor="genre">Genre:</label>
                        <input type="text" name="genre" defaultValue={story.genre} required />
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <p>Loading story details...</p>
            )}
            <button onClick={() => navigate(-1)}>Cancel</button>
        </div>
    );
}
export default EditStoryDetails;