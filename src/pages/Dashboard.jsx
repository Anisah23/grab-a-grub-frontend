import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import './Dashboard.css';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cookingTime, setCookingTime] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, cookingTime]);

  const fetchRecipes = async () => {
    try {
      console.log('Fetching recipes...');
      const response = await axios.get('/api/recipes');
      console.log('Recipes received:', response.data);
      setRecipes(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(recipe => {
        const titleMatch = recipe.title?.toLowerCase().includes(searchLower);
        const ingredientsMatch = recipe.ingredients?.toLowerCase().includes(searchLower);
        const descriptionMatch = recipe.description?.toLowerCase().includes(searchLower);
        const authorMatch = recipe.user?.username?.toLowerCase().includes(searchLower);
        
        return titleMatch || ingredientsMatch || descriptionMatch || authorMatch;
      });
    }

  
    if (cookingTime) {
      const time = parseInt(cookingTime);
      if (!isNaN(time)) {
        filtered = filtered.filter(recipe => recipe.cooking_time <= time);
      }
    }

    setFilteredRecipes(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchRecipes();
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Explore Recipes</h1>
            <p>Discover amazing recipes from our community</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="btn btn-secondary"
            disabled={loading}
          >
            <i className="fas fa-sync-alt"></i> 
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search recipes, ingredients, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          <div className="filters">
            <select 
              value={cookingTime} 
              onChange={(e) => setCookingTime(e.target.value)}
            >
              <option value="">All Cooking Times</option>
              <option value="15">15 minutes or less</option>
              <option value="30">30 minutes or less</option>
              <option value="60">1 hour or less</option>
              <option value="120">2 hours or less</option>
            </select>
            {cookingTime && (
              <button 
                className="clear-filter"
                onClick={() => setCookingTime('')}
                title="Clear filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="recipes-stats">
          <p>Showing {filteredRecipes.length} of {recipes.length} recipes</p>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="no-recipes">
            <i className="fas fa-search fa-3x"></i>
            <h3>No recipes found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;