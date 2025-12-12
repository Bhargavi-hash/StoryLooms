import "../styles/StoriesGrid.css";
import { useNavigate } from "react-router-dom";

export default function StoriesGrid({ stories }) {
  const navigate = useNavigate();

  return (
    <div className="stories-container">
      {stories.map((story) => {
        const hasCover =
          story.coverURL && story.coverURL.trim() !== "";

        return (
          <div
            key={story._id}
            className="story-card"
            onClick={() => navigate(`/stories/${story._id}`)}
          >
            <div className="story-card-image-container">
              {hasCover ? (
                <img
                  src={story.coverURL}
                  alt="cover"
                  className="story-card-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.classList.add(
                      "story-card-fallback"
                    );
                  }}
                />
              ) : (
                <div className="story-card-fallback">
                  <span className="story-card-fallback-title">
                    {story.title}
                  </span>
                </div>
              )}
            </div>

            <div className="story-card-title">{story.title}</div>
            <div className="story-card-sub">
              {story.collections} collections
            </div>
          </div>
        );
      })}
    </div>
  );
}
