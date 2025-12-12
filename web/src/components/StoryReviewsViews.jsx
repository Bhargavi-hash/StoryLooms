import "../styles/StoryReviewsViews.css";

export default function StoryReviewsView({
  reviews,
  userId,
  userReview,
  userRating,
  editing,
  repliesMap,
  setUserReview,
  setUserRating,
  updateLikes,
  fetchReplies,
  handleAddReply,
  handleSubmit
}) {
  // Safety nets – React renders before props arrive
  const safeReviews = reviews || [];
  const safeRepliesMap = repliesMap || {};

  return (
    <div className="reviews-container">
      <h3>Reviews ({safeReviews.length})</h3>
        {/* Add New Review */}
        <button className="add-review-btn" onClick={() => {
          setUserReview("");
          setUserRating("");
        }}>
          {editing ? "Edit Your Review" : "Write a Review"}
        </button>
      {safeReviews.length === 0 && <p>No reviews yet. Be the first to write one!</p>}
        

      <ul className="review-list">
        {/* Top 5  */}
        {safeReviews.slice(0, 5).map(review => {
          const directReplies = safeRepliesMap[review._id] || [];

          return (
            <li key={review._id} className="review-card">
              <strong>{review.user.username}</strong>
              <p>{review.content}</p>
              <p>Rating: {review.rating} Star{review.rating > 1 ? "s" : ""}</p>

              <button onClick={() => updateLikes(review._id)}>
                {review.likes} Likes
              </button>

              <button onClick={() => fetchReplies("Review", review._id)}>
                Show Replies
              </button>

              {/* Replies */}
              {directReplies.length > 0 && (
                <ul className="reply-list">
                  {directReplies.map(reply => {
                    const nestedReplies = safeRepliesMap[reply._id] || [];

                    return (
                      <li key={reply._id}>
                        <strong>{reply.user.username}</strong>: {reply.content}

                        <button onClick={() => fetchReplies("Comment", reply._id)}>
                          Show Replies
                        </button>

                        {/* Nested replies */}
                        {nestedReplies.length > 0 && (
                          <ul className="nested-reply-list">
                            {nestedReplies.map(r => (
                              <li key={r._id}>
                                <strong>{r.user.username}</strong>: {r.content}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Reply to replies */}
                        {userId && (
                          <input
                            className="reply-input"
                            type="text"
                            placeholder="Write a reply..."
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" && e.target.value.trim()) {
                                await handleAddReply(
                                  "Comment",
                                  reply._id,
                                  e.target.value.trim()
                                );
                                e.target.value = "";
                              }
                            }}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Reply to review */}
              {userId && (
                <input
                  className="reply-input"
                  type="text"
                  placeholder="Write a reply..."
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      await handleAddReply("Review", review._id, e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>

      {/* Add / Edit Review Form */}
      {userId && (
        <form onSubmit={handleSubmit} className="review-form">
          <h4>{editing ? "Edit Your Review" : "Write a Review"}</h4>

          <select
            value={userRating}
            onChange={(e) => setUserRating(e.target.value)}
          >
            <option value="">Rate this story</option>
            {[1, 2, 3, 4, 5].map(star => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            rows="4"
          />

          <button type="submit">
            {editing ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
