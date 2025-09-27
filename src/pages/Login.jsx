import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import * as Yup from 'yup';
import './Auth.css';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            const result = await login(values.username, values.password);
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
                  placeholder="Enter your username" 
                />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <Field 
                  type="password" 
                  name="password" 
                  className="form-input" 
                  placeholder="Enter your password" 
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;