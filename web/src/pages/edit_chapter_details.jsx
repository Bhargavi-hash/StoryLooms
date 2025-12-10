import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

function EditChapterDetails() {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const [chapterDetails, setChapterDetails] = useState({ title: '', content: '' });

    useEffect(() => {
        const fetchChapterDetails = async () => {
            const response = await fetch(`${API_BASE}/api/chapters/${chapterId}`);
            if (response.ok) {
                const data = await response.json();
                setChapterDetails({ title: data.title, content: data.content, isPublished: data.isPublished });
            }
        };
        fetchChapterDetails();
    }, [chapterId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const updateChapter = async () => {
            const response = await fetch(`${API_BASE}/api/chapters/edit/${chapterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: event.target.title.value,
                    content: event.target.content.value,
                    isPublished: event.target.isPublished.checked,
                }),
            });
            if (response.ok) {
                navigate(-1); // Navigate back to the previous page
                alert('Chapter updated successfully');
            } else {
                alert('Failed to update chapter');
            }
        };
        updateChapter();
    };

    return (
        <div>
            <h1>Edit Chapter Details</h1>
            {/* Form for editing chapter details goes here */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" value={chapterDetails.title} onChange={(e) => setChapterDetails({ ...chapterDetails, title: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea id="content" name="content" value={chapterDetails.content} onChange={(e) => setChapterDetails({ ...chapterDetails, content: e.target.value })}></textarea>
                </div>
                <div>
                    <label htmlFor="isPublished">Publish:</label>
                    <input type="checkbox" id="isPublished" name="isPublished" defaultChecked={chapterDetails.isPublished} />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditChapterDetails;