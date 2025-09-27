import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const [userResponse, recipesResponse] = await Promise.all([
        axios.get(`/api/users/${id}`),
        axios.get(`/api/recipes/user/${id}`)
      ]);
      
      setUser(userResponse.data);
      setRecipes(recipesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="container">
        <div className="user-not-found">
          <h2>User not found</h2>
          <Link to="/dashboard" className="btn btn-primary">Back to Recipes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <img 
                src={user.profile_picture || '/default-avatar.png'} 
                alt={user.username}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150/007bff/ffffff?text=' + user.username.charAt(0).toUpperCase();
                }}
              />
            </div>
            <div className="profile-details">
              <h1>{user.username}</h1>
              <p className="profile-email">{user.email}</p>
              {user.bio && <p className="profile-bio">{user.bio}</p>}
              
              <div className="profile-stats">
                <div className="stat">
                  <strong>{recipes.length}</strong>
                  <span>Recipes</span>
                </div>
                <div className="stat">
                  <strong>{user.likes_received || 0}</strong>
                  <span>Likes Received</span>
                </div>
                <div className="stat">
                  <strong>Member since</strong>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <i className="fas fa-book"></i> Recipes ({recipes.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'recipes' && (
            <div className="recipes-tab">
              {recipes.length === 0 ? (
                <div className="no-content">
                  <i className="fas fa-book fa-3x"></i>
                  <h3>No recipes yet</h3>
                  <p>{user.username} hasn't shared any recipes yet.</p>
                </div>
              ) : (
                <div className="recipe-grid">
                  {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;