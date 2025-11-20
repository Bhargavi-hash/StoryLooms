import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ChapterPage() {
    const { chapterId } = useParams(); // Grabs chapterId from URL
    const [chapter, setChapter] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChapter = async () => {
            const response = await fetch(`http://localhost:4000/api/chapters/${chapterId}`);
            if (response.ok) {
                const data = await response.json();
                setChapter(data);
            }
        };
        fetchChapter();
    }, [chapterId]);

    if (!chapter) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{chapter.title}</h1>
            <p>{chapter.content}</p>

            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    );
}

export default ChapterPage;