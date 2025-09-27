import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import './Favorites.css';

const Favorites = () => {
  const { user } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`/api/favorites/user/${user.id}`);
      // Extract recipes from favorites
      const favoriteRecipes = response.data.map(fav => fav.recipe);
      setFavorites(favoriteRecipes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await axios.delete('/api/favorites', {
        data: { recipe_id: recipeId }
      });
      setFavorites(favorites.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="not-logged-in">
          <h2>Please log in to view your favorites</h2>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading your favorites...</div>;
  }

  return (
    <div className="favorites">
      <div className="container">
        <div className="favorites-header">
          <div>
            <h1>My Favorite Recipes</h1>
            <p>Recipes you've saved for later</p>
          </div>
          {favorites.length > 0 && (
            <div className="favorites-stats">
              <h3>{favorites.length}</h3>
              <p>Favorite{favorites.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="no-favorites">
            <i className="fas fa-heart"></i>
            <h3>No favorites yet</h3>
            <p>Start exploring recipes and add them to your favorites!</p>
            <Link to="/dashboard" className="btn btn-primary">
              Explore Recipes
            </Link>
          </div>
        ) : (
          <div className="favorites-content">
            <div className="favorites-grid">
              {favorites.map(recipe => (
                <div key={recipe.id} className="favorite-item">
                  <div className="favorite-actions">
                    <button 
                      onClick={() => handleRemoveFavorite(recipe.id)}
                      className="remove-favorite"
                      title="Remove from favorites"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;