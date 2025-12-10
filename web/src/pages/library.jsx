import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { API_BASE } from '../config';

function Library() {
    const [library, setLibrary] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLibrary = async () => {
            const response = await fetch(`${API_BASE}/api/users/library`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLibrary(data);
            } else {
                alert('Failed to fetch library');
            }
        };
        fetchLibrary();
    }, []);

    const removeFromLibrary = async (storyId) => {
        const response = await fetch(`${API_BASE}/api/users/remove-from-library/${storyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setLibrary(data.library || []);
        } else {
            alert('Failed to remove story from library');
        }
    };

    return (
        <div>
            <h1>Your Library</h1>
            {library.length === 0 ? (
                <p>Your library is empty.</p>
            ) : (
                <ul>
                    {library.map((story) => (
                        <li key={story._id}>
                            <h2>{story.title}</h2>
                            {/* <p>{story.description}</p> */}
                            <button onClick={() => navigate(`/stories/${story._id}`)}>Read Story</button>
                            <button onClick={() => removeFromLibrary(story._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => window.location.href = '/'}>Go to Home</button>
        </div>
    );
}

export default Library;