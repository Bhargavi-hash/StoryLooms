import "../styles/StoryPage.css";

function StoryPageView({
    story,
    chapterDetails,
    onAddToLibrary,
    onRemoveFromLibrary,
    isInLibrary,
    onChapterClick,
    onBackHome,
    reviewsComponent,
}) {
    if (!story) return <div>Loading...</div>;

    return (
        <div className="story-container">
            <h1 className="story-title">{story.title}</h1>
            <p className="story-description">{story.description}</p>

            <div className="story-meta">
                <p><strong>Author:</strong> {story.author?.username || "Unknown"}</p>
                <p><strong>Genre:</strong> {story.genre}</p>
                <p><strong>Collections:</strong> {story.collections}</p>
                <p><strong>Chapters:</strong> {story.chapters.length}</p>
            </div>

            {/* Library Button */}
            {isInLibrary ? (
                <button className="library-btn remove" onClick={onRemoveFromLibrary}>
                    Remove from Library
                </button>
            ) : (
                <button className="library-btn add" onClick={onAddToLibrary}>
                    Add to Library
                </button>
            )}

            <button className="home-btn" onClick={onBackHome}>
                Go to Home
            </button>

            <hr />

            <h2 className="chapter-heading">Chapters ({story.chapters.length})</h2>

            <ul className="chapter-list">
                {/* Only top-5 chapters */}
                {story.chapters.slice(0, 5).map((chapter_ID) => {
                    const chapter = chapterDetails[chapter_ID];

                    if (!chapter || !chapter.isPublished) return null;

                    return (
                        <li key={chapter_ID} className="chapter-item">
                            <h4
                                className="chapter-title"
                                onClick={() => onChapterClick(chapter_ID)}
                            >
                                {chapter.title}
                            </h4>

                            <p className="chapter-date">
                                <em>Updated On: {new Date(chapter.updatedAt).toLocaleString()}</em>
                            </p>
                        </li>
                    );
                })}
            </ul>
            {/* Reviews Section */}
            <div className="reviews-section">
                {reviewsComponent}
            </div>

        </div>
    );
}

export default StoryPageView;
