import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from '../api/axios';
import * as Yup from 'yup';
import './RecipeForm.css';

const RecipeSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  ingredients: Yup.string()
    .min(10, 'Ingredients must be at least 10 characters')
    .required('Ingredients are required'),
  instructions: Yup.string()
    .min(10, 'Instructions must be at least 10 characters')
    .required('Instructions are required'),
  cooking_time: Yup.number()
    .min(1, 'Cooking time must be at least 1 minute')
    .max(1000, 'Cooking time must be reasonable')
    .required('Cooking time is required'),
  image_url: Yup.string().url('Must be a valid URL'),
});

const RecipeForm = ({ recipe, onClose, onSuccess }) => {
  const isEditing = !!recipe;

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      if (isEditing) {
        await axios.patch(`/api/recipes/${recipe.id}`, values);
      } else {
        await axios.post('/api/recipes', values);
      }
      onSuccess();
    } catch (error) {
      setStatus(error.response?.data?.error || 'Error saving recipe');
    }
    setSubmitting(false);
  };

  return (
    <div className="recipe-form-overlay">
      <div className="recipe-form-modal">
        <div className="recipe-form-header">
          <h2>{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</h2>
          <button onClick={onClose} className="close-button">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <Formik
          initialValues={{
            title: recipe?.title || '',
            description: recipe?.description || '',
            ingredients: recipe?.ingredients || '',
            instructions: recipe?.instructions || '',
            cooking_time: recipe?.cooking_time || '',
            image_url: recipe?.image_url || '',
          }}
          validationSchema={RecipeSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="recipe-form">
              {status && <div className="error">{status}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Recipe Title</label>
                  <Field 
                    type="text" 
                    name="title" 
                    className="form-input" 
                    placeholder="e.g., Classic Spaghetti Carbonara" 
                  />
                  <ErrorMessage name="title" component="div" className="error" />
                </div>

                <div className="form-group">
                  <label htmlFor="cooking_time" className="form-label">Cooking Time (minutes)</label>
                  <Field 
                    type="number" 
                    name="cooking_time" 
                    className="form-input" 
                    placeholder="e.g., 30" 
                  />
                  <ErrorMessage name="cooking_time" component="div" className="error" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description (Optional)</label>
                <Field 
                  as="textarea" 
                  name="description" 
                  className="form-input" 
                  placeholder="Brief description of your recipe..." 
                  rows="3"
                />
                <ErrorMessage name="description" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="image_url" className="form-label">Image URL (Optional)</label>
                <Field 
                  type="url" 
                  name="image_url" 
                  className="form-input" 
                  placeholder="https://example.com/recipe-image.jpg" 
                />
                <ErrorMessage name="image_url" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="ingredients" className="form-label">Ingredients</label>
                <Field 
                  as="textarea" 
                  name="ingredients" 
                  className="form-input" 
                  placeholder="List ingredients, one per line...
e.g., 
2 cups flour
1 tsp salt
..." 
                  rows="6"
                />
                <ErrorMessage name="ingredients" component="div" className="error" />
                <small>Enter each ingredient on a new line</small>
              </div>

              <div className="form-group">
                <label htmlFor="instructions" className="form-label">Instructions</label>
                <Field 
                  as="textarea" 
                  name="instructions" 
                  className="form-input" 
                  placeholder="Step-by-step instructions...
e.g., 
1. Preheat oven to 350°F
2. Mix dry ingredients
..." 
                  rows="8"
                />
                <ErrorMessage name="instructions" component="div" className="error" />
                <small>Enter each step on a new line, starting with step numbers</small>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Recipe' : 'Create Recipe')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RecipeForm;