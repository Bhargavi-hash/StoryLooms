import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function StoryReviews({ storyId }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState("");
  const [editing, setEditing] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [userRating, setUserRating] = useState("");
  const [repliesMap, setRepliesMap] = useState({}); // To store replies for each review
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  // Fetch all reviews for this story
  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`${API_BASE}/api/reviews/story/${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);

        // Check if current user has a review
        const existing = data.find(r => r.user._id === userId);
        if (existing) {
          setUserReview(existing.content);
          setReviewId(existing._id);
          setEditing(true);
          setUserRating(existing.rating);
        }
      }
    };
    fetchReviews();
  }, [storyId]);

  const updateLikes = async (id) => {
    const response = await fetch(`${API_BASE}/api/reviews/${id}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const updatedReview = await response.json();
      setReviews(prev =>
        prev.map(r => (r._id === updatedReview._id ? updatedReview : r))
      );
    } else {
      alert("Failed to update likes.");
    }
  };

  const fetchReplies = async (parentType, parentId) => {
    const response = await fetch(`${API_BASE}/api/comments/${parentType}/${parentId}`);
    if (response.ok) {
      const data = await response.json();
      setRepliesMap(prev => ({ ...prev, [parentId]: data }));
    } else {
      alert("Failed to fetch replies.");
    }
  };

  const handleAddReply = async (parentType, parentId, content) => {
  const response = await fetch(`${API_BASE}/api/comments/${parentType}/${parentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (response.ok) {
    const newReply = await response.json();
    setRepliesMap(prev => ({
      ...prev,
      [parentId]: prev[parentId] ? [...prev[parentId], newReply] : [newReply]
    }));
  } else {
    alert("Failed to post reply.");
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${API_BASE}/api/reviews/${reviewId}`
      : `${API_BASE}/api/reviews/${storyId}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ story: storyId, content: userReview, rating: userRating }),
    });

    if (response.ok) {
      alert(editing ? "Review updated!" : "Review added!");
      const updated = await response.json();
      setReviews(prev =>
        editing
          ? prev.map(r => (r._id === updated._id ? updated : r))
          : [...prev, updated]
      );
      setEditing(true);
      setReviewId(updated._id);
    } else {
      alert("Failed to submit review.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet. Be the first to write one!</p>}

      <ul>
  {reviews.map(review => (
    <li key={review._id} style={{ margin: "10px 0", border: "1px solid #ddd", padding: "10px" }}>
      <strong>{review.user.username}</strong>
      <p>{review.content}</p>
      <p>Rating: {review.rating} Star{review.rating > 1 ? "s" : ""}</p>
      <button onClick={() => updateLikes(review._id)}>{review.likes} Likes</button>

      <button onClick={() => fetchReplies("Review", review._id)}>Show Replies</button>

      {/* Display replies */}
      {repliesMap[review._id]?.length > 0 && (
        <ul style={{ paddingLeft: "1rem", borderLeft: "2px solid #ccc", marginTop: "10px" }}>
          {repliesMap[review._id].map(reply => (
            <li key={reply._id}>
              <strong>{reply.user.username}</strong>: {reply.content}
              <button onClick={() => fetchReplies("Comment", reply._id)}>Show Replies</button>
              
              {/* Optional nested replies display */}
              {repliesMap[reply._id]?.length > 0 && (
                <ul style={{ paddingLeft: "1rem" }}>
                  {repliesMap[reply._id].map(r => (
                    <li key={r._id}><strong>{r.user.username}</strong>: {r.content}</li>
                  ))}
                </ul>
              )}

              {/* Reply input box */}
              {userId && (
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        await handleAddReply("Comment", reply._id, e.target.value.trim());
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add reply to review */}
      {userId && (
        <div style={{ marginTop: "5px" }}>
          <input
            type="text"
            placeholder="Write a reply..."
            onKeyDown={async (e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                await handleAddReply("Review", review._id, e.target.value.trim());
                e.target.value = "";
              }
            }}
          />
        </div>
      )}
    </li>
  ))}
</ul>


      {userId && (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <h4>{editing ? "Edit Your Review" : "Write a Review"}</h4>
          {/* Rating */}
          <select
            value={userRating}
            onChange={(e) => setUserRating(e.target.value)}
            style={{ marginBottom: "1rem" }}
          >
            <option value="">Rate this story</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            rows="4"
            style={{ width: "100%", padding: "8px" }}
          />
          <button type="submit" style={{ marginTop: "0.5rem" }}>
            {editing ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}

export default StoryReviews;
