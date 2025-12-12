import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "../config";
import StoryReviewsView from "../components/StoryReviewsViews";

function StoryReviews({ storyId }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState("");
  const [editing, setEditing] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [userRating, setUserRating] = useState("");
  const [repliesMap, setRepliesMap] = useState({});

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  // Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`${API_BASE}/api/reviews/story/${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);

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
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      const updated = await response.json();
      setReviews(prev => prev.map(r => (r._id === updated._id ? updated : r)));
    }
  };

  const fetchReplies = async (parentType, parentId) => {
    const response = await fetch(`${API_BASE}/api/comments/${parentType}/${parentId}`);
    if (response.ok) {
      const data = await response.json();
      setRepliesMap(prev => ({ ...prev, [parentId]: data }));
    }
  };

  const handleAddReply = async (parentType, parentId, content) => {
    const response = await fetch(`${API_BASE}/api/comments/${parentType}/${parentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      const newReply = await response.json();
      setRepliesMap(prev => ({
        ...prev,
        [parentId]: prev[parentId] ? [...prev[parentId], newReply] : [newReply]
      }));
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
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ story: storyId, content: userReview, rating: userRating })
    });

    if (response.ok) {
      const updated = await response.json();
      setReviews(prev =>
        editing
          ? prev.map(r => (r._id === updated._id ? updated : r))
          : [...prev, updated]
      );
      setEditing(true);
      setReviewId(updated._id);
    }
  };

  return (
    <StoryReviewsView
      reviews={reviews}
      userId={userId}
      userReview={userReview}
      userRating={userRating}
      editing={editing}
      repliesMap={repliesMap}
      setUserReview={setUserReview}
      setUserRating={setUserRating}
      updateLikes={updateLikes}
      fetchReplies={fetchReplies}
      handleAddReply={handleAddReply}
      handleSubmit={handleSubmit}
    />
  );
}

export default StoryReviews;
