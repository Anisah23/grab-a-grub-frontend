import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from '../api/axios';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete('/api/comments', {
        data: { comment_id: commentId }
      });
      setComments(comments.filter(comment => comment.id !== commentId));
      showToast('Comment deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('Failed to delete comment', 'error');
    }
  };

  const canDeleteComment = (comment) => {
    if (!user) return false;
    // Handle both old and new comment formats
    const commentUserId = comment.user_id || comment.user?.id;
    const recipeOwnerId = recipe?.user?.id;
    return commentUserId === user.id || recipeOwnerId === user.id;
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const [recipeResponse, commentsResponse] = await Promise.all([
        axios.get(`/api/recipes/${id}`),
        axios.get(`/api/comments/recipe/${id}`)
      ]);
      
      setRecipe(recipeResponse.data);
      setComments(commentsResponse.data);
      setLikeCount(recipeResponse.data.likes ? recipeResponse.data.likes.length : 0);
      
      // Check if user has liked or favorited this recipe
      if (user) {
        const isLikedByUser = recipeResponse.data.likes?.some(like => like.user_id === user.id);
        const isFavoritedByUser = recipeResponse.data.favorites?.some(fav => fav.user_id === user.id);
        setIsLiked(!!isLikedByUser);
        setIsFavorite(!!isFavoritedByUser);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await axios.delete('/api/likes', {
          data: { recipe_id: parseInt(id) }
        });
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await axios.post('/api/likes', {
          recipe_id: parseInt(id)
        });
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      if (error.response?.data?.error) {
        showToast(error.response.data.error, 'error');
      } else {
        showToast('Failed to update like. Please try again.', 'error');
      }
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete('/api/favorites', {
          data: { recipe_id: parseInt(id) }
        });
        setIsFavorite(false);
      } else {
        await axios.post('/api/favorites', {
          recipe_id: parseInt(id)
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.response?.data?.error) {
        showToast(error.response.data.error, 'error');
      } else {
        showToast('Failed to update favorite. Please try again.', 'error');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    const content = newComment.trim();
    if (!content) {
      showToast('Please enter a comment', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/comments', {
        content: content,
        recipe_id: parseInt(id)
      });
      
      if (response.data) {
        setComments([response.data, ...comments]);
        setNewComment('');
        showToast('Comment posted successfully!', 'success');
      }
    } catch (error) {
      console.error('Comment error:', error);
      const errorMsg = error.response?.data?.error || 'Failed to post comment';
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  if (!recipe) {
    return (
      <div className="container">
        <div className="recipe-not-found">
          <h2>Recipe not found</h2>
          <Link to="/dashboard" className="btn btn-primary">Back to Recipes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/dashboard">Recipes</Link> 
          <span> / </span>
          <span>{recipe.title}</span>
        </nav>

        <article className="recipe-article">
          <header className="recipe-header">
            <div className="recipe-image">
              <img 
                src={recipe.image_url || '/default-recipe.jpg'} 
                alt={recipe.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400/007bff/ffffff?text=Recipe+Image';
                }}
              />
            </div>
            
            <div className="recipe-meta">
              <h1>{recipe.title}</h1>
              <p className="recipe-description">{recipe.description}</p>
              
              <div className="recipe-author">
                <Link to={`/user/${recipe.user.id}`}>
                  <img 
                    src={recipe.user.profile_picture || '/default-avatar.png'} 
                    alt={recipe.user.username}
                    className="author-avatar"
                  />
                  <span>By {recipe.user.username}</span>
                </Link>
              </div>

              <div className="recipe-stats">
                <div className="stat">
                  <i className="fas fa-clock"></i>
                  <span>{recipe.cooking_time} minutes</span>
                </div>
                <div className="stat">
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="recipe-actions">
                <button 
                  onClick={handleLike}
                  className={`btn btn-like ${isLiked ? 'liked' : ''}`}
                >
                  <i className={`fas fa-heart ${isLiked ? 'fas' : 'far'}`}></i>
                  {likeCount} Likes
                </button>
                
                <button 
                  onClick={handleFavorite}
                  className={`btn btn-favorite ${isFavorite ? 'favorited' : ''}`}
                >
                  <i className={`fas fa-star ${isFavorite ? 'fas' : 'far'}`}></i>
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </header>

          <div className="recipe-content">
            <section className="ingredients-section">
              <h2>Ingredients</h2>
              <div className="ingredients">
                {recipe.ingredients.split('\n').map((ingredient, index) => (
                  ingredient.trim() && (
                    <div key={index} className="ingredient">
                      <i className="fas fa-check-circle"></i>
                      <span>{ingredient.trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </section>

            <section className="instructions-section">
              <h2>Instructions</h2>
              <div className="instructions">
                {recipe.instructions.split('\n').map((instruction, index) => (
                  instruction.trim() && (
                    <div key={index} className="instruction-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">{instruction.trim()}</div>
                    </div>
                  )
                ))}
              </div>
            </section>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                rows="3"
                disabled={isSubmitting}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to leave a comment
            </p>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <div className="comment-author">
                      <img 
                        src={comment.user.profile_picture || '/default-avatar.png'} 
                        alt={comment.user.username}
                      />
                      <div>
                        <strong>{comment.user.username}</strong>
                        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {canDeleteComment(comment) && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-comment-btn"
                        title="Delete comment"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipeDetail;