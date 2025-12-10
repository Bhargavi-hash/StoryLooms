import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

function CreateStory() {
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle story creation logic here
        const response = await fetch(`${API_BASE}/api/stories`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: event.target.title.value,
                description: event.target.content.value,
            }),
        });
        if (response.ok) {
            alert('Story created successfully');
            // Navigate to the story display page
            const data = await response.json();
            navigate(`/stories/${data.story._id}`);
        } else {
            alert('Failed to create story');
        }
    }
    return (
        <div>
            <h1>Create a New Story</h1>
            <p>This is where the story creation form will go.</p>
            {/* form section */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Story Title:</label>
                    <input type="text" name="title" required />
                </div>
                <div>
                    <label htmlFor="content">Description:</label>
                    <textarea name="content"></textarea>
                </div>
                <button type="submit">Create Story</button>
            </form>

            <button onClick={() => window.location.href = '/'}>Go to Home</button>
        </div>
    );
}

export default CreateStory;