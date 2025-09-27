import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from '../api/axios';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(recipe.likes?.some(like => like.user_id === user?.id) || false);
  const [likeCount, setLikeCount] = useState(recipe.likes?.length || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await axios.delete('/api/likes', {
          data: { recipe_id: recipe.id }
        });
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await axios.post('/api/likes', {
          recipe_id: recipe.id
        });
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-card-link">
        <div className="recipe-image">
          <img 
            src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} 
            alt={recipe.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
            }}
          />
          <div className="recipe-overlay">
            <div className="cooking-time">
              <i className="fas fa-clock"></i>
              {recipe.cooking_time} min
            </div>
          </div>
        </div>
        
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-description">
            {recipe.description && recipe.description.length > 100 
              ? `${recipe.description.substring(0, 100)}...` 
              : recipe.description
            }
          </p>
          
          <div className="recipe-meta">
            <Link to={`/user/${recipe.user.id}`} className="recipe-author">
              <img 
                src={recipe.user.profile_picture || '/default-avatar.png'} 
                alt={recipe.user.username}
              />
              <span>{recipe.user.username}</span>
            </Link>
            
            <div className="recipe-stats">
              <button 
                onClick={handleLike}
                className={`like-btn ${isLiked ? 'liked' : ''}`}
              >
                <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i> {likeCount}
              </button>
              <span>
                <i className="fas fa-comment"></i> {recipe.comments ? recipe.comments.length : 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;