import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import * as Yup from 'yup';
import './Auth.css';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const Signup = () => {
  const { signup } = useUser();
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        
        <Formik
          initialValues={{ 
            username: '', 
            email: '', 
            password: '', 
            confirmPassword: '',
            bio: '' 
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            const { confirmPassword, ...userData } = values;
            const result = await signup(userData);
            if (result.success) {
              navigate('/dashboard');
            } else {
              setStatus(result.error);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {status && <div className="error">{status}</div>}
              
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <Field 
                  type="text" 
                  name="username" 
                  className="form-input" 
                  placeholder="Choose a username" 
                />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Field 
                  type="email" 
                  name="email" 
                  className="form-input" 
                  placeholder="Enter your email" 
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <Field 
                  type="password" 
                  name="password" 
                  className="form-input" 
                  placeholder="Create a password" 
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <Field 
                  type="password" 
                  name="confirmPassword" 
                  className="form-input" 
                  placeholder="Confirm your password" 
                />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  Bio (Optional)
                </label>
                <Field 
                  as="textarea" 
                  name="bio" 
                  className="form-input" 
                  placeholder="Tell us about yourself..." 
                  rows="3"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;