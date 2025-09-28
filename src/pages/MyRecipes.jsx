import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';
import Modal from '../components/Modal';
import './MyRecipes.css';

const MyRecipes = () => {
  const { user } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyRecipes();
    }
  }, [user]);

  const fetchMyRecipes = async () => {
    try {
      const response = await axios.get(`/api/recipes/user/${user.id}`);
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const handleCreateRecipe = () => {
    setEditingRecipe(null);
    setShowForm(true);
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleDeleteRecipe = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/recipes/${recipeToDelete.id}`);
      setRecipes(recipes.filter(recipe => recipe.id !== recipeToDelete.id));
      setShowDeleteModal(false);
      setRecipeToDelete(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setErrorMessage('Error deleting recipe. Please try again.');
      setShowDeleteModal(false);
      setShowErrorModal(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleFormSuccess = () => {
    fetchMyRecipes();
    handleFormClose();
  };

  if (!user) {
    return (
      <div className="container">
        <div className="not-logged-in">
          <h2>Please log in to view your recipes</h2>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading your recipes...</div>;
  }

  return (
    <div className="my-recipes">
      <div className="container">
        <div className="my-recipes-header">
          <div>
            <h1>My Recipes</h1>
            <p>Manage your culinary creations</p>
          </div>
          <button 
            onClick={handleCreateRecipe}
            className="btn btn-primary"
          >
            <i className="fas fa-plus"></i> Add New Recipe
          </button>
        </div>

        {recipes.length === 0 ? (
          <div className="no-recipes">
            <i className="fas fa-book fa-3x"></i>
            <h3>No recipes yet</h3>
            <p>Start sharing your culinary creations with the community!</p>
            <button 
              onClick={handleCreateRecipe}
              className="btn btn-primary"
            >
              Create Your First Recipe
            </button>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card-wrapper">
                <RecipeCard recipe={recipe} />
                <div className="recipe-actions">
                  <button 
                    onClick={() => handleEditRecipe(recipe)}
                    className="btn btn-secondary btn-small"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteRecipe(recipe)}
                    className="btn btn-danger btn-small"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <RecipeForm
            recipe={editingRecipe}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Recipe"
          message={`Are you sure you want to delete "${recipeToDelete?.title}"? This action cannot be undone.`}
          type="confirm"
        />

        <Modal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Error"
          message={errorMessage}
          type="alert"
        />
      </div>
    </div>
  );
};

export default MyRecipes;