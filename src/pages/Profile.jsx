import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from '../api/axios';
import * as Yup from 'yup';
import './Profile.css';

const ProfileSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
});

const Profile = () => {
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadMode, setUploadMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  if (!user) {
    return (
      <div className="container">
        <div className="not-logged-in">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let response;
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('bio', values.bio || '');
        formData.append('profile_picture', selectedFile);
        
        response = await axios.patch(`/api/users/${user.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.patch(`/api/users/${user.id}`, {
          username: values.username,
          email: values.email,
          bio: values.bio || ''
        });
      }
      
      updateUser(response.data);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMsg = error.response?.data?.error || 'Error updating profile';
      setMessage(errorMsg);
    }
    setSubmitting(false);
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!editing && (
            <button 
              onClick={() => {
                setEditing(true);
                setTimeout(() => {
                  document.querySelector('.profile-form')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }, 100);
              }}
              className="btn btn-secondary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-stats-container">
          <div className="profile-stats">
            <h3>Stats</h3>
            <div className="stat">
              <i className="fas fa-book"></i>
              <span>Recipes: {user.recipe_count || 0}</span>
            </div>
            <div className="stat">
              <i className="fas fa-user-clock"></i>
              <span>Member since: {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-top">
              <div className="profile-left">
                <div className="profile-picture">
                  {user.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt={user.username}
                    />
                  ) : (
                    <div className="no-profile-pic">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                
                {user.bio ? (
                  <div className="profile-bio">
                    <h3>About Me</h3>
                    <p>{user.bio}</p>
                  </div>
                ) : (
                  <div className="profile-bio">
                    <h3>About Me</h3>
                    <p className="no-bio">No bio yet. Add one to tell the community about yourself!</p>
                  </div>
                )}
              </div>
              
              <div className="profile-info">
                <h2 className="profile-name">{user.username}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>
            
            {editing && (
              <Formik
                initialValues={{
                  username: user.username || '',
                  email: user.email || '',
                  bio: user.bio || '',
                  profile_picture: ''
                }}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="profile-form">
                    <div className="form-group">
                      <label className="form-label">Username</label>
                      <Field 
                        type="text" 
                        name="username"
                        className="form-input" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <Field 
                        type="email" 
                        name="email"
                        className="form-input" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Profile Picture</label>
                      <input 
                        type="file" 
                        className="form-input" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <small style={{color: '#28a745'}}>Selected: {selectedFile.name}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bio</label>
                      <Field 
                        as="textarea" 
                        name="bio" 
                        className="form-input" 
                        placeholder="Tell us about yourself..." 
                        rows="4"
                      />
                    </div>

                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;