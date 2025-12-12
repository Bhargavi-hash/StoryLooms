import "../styles/CreatorStoryCard.css";
import { useNavigate } from "react-router-dom";

export default function CreatorStoryCard({ story, onDelete }) {
    const navigate = useNavigate();

    const statusColor = {
        published: "#2AAA8A",
        achieved: "#ff9800",
        draft: "#888",
    };

    return (
        <div
            className="creator-story-card"
            onClick={() => navigate(`/stories/author-view/${story._id}`)}
        >
            {/* LEFT: Cover Image */}
            <div className="creator-cover-wrapper">
                <img
                    src={story.coverURL || "/default-story-cover.jpg"}
                    alt="story cover"
                    className="creator-cover-image"
                />
            </div>

            {/* RIGHT: Details */}
            <div className="creator-info">
                <h2 className="creator-title">{story.title}</h2>

                <span
                    className="creator-status"
                    style={{ backgroundColor: statusColor[story.publicationStatus || "draft"] }}
                >
                    {story.publicationStatus ? story.publicationStatus.toUpperCase() : "DRAFT"}
                </span>

                {/* Collections */}
                <p className="collections">
                    Collections: {story.collections || 0}
                </p>

                <p className="creator-description">
                    {story.description?.substring(0, 120)}...
                </p>

                <p className="creator-date">
                    Updated On: {new Date(story.updatedAt).toLocaleDateString()}
                </p>


                <button
                    className="creator-delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(story._id);
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

