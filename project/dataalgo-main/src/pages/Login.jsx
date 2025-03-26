import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
// Custom Components
import { SetCookie } from '../components/auth/cookies.jsx';

//Ant Design Components && Icons
import { Alert } from 'antd';

//CSS Components for styling
import LoginStyle from "../assets/styles/login.module.css";
import FormStyle from "../assets/styles/form.module.css";

const Login = () => {
  // System Variables
  const navigate = useNavigate();

  // User Input Variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Custom alert variables
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [alertVisible, setAlertVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', {
        username,
        password
      });
  
      const data = response.data;
      const cookieData = {
        id: data.id,
        username: data.username,
        token: data.token,
        password: password
      };
      SetCookie('data', cookieData, {
        expires: 7,
        secure: true,
        sameSite: 'Strict'
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        setAlert({ type: 'error', message: 'Invalid credentials. Please try again.' });
      } else {
        setAlert({ type: 'error', message: 'Server error. Please try again later.' });
      }
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    }
  };

  return (
    <>
      <div className={`${LoginStyle.Alert} ${alertVisible ? LoginStyle.AlertVisible : LoginStyle.AlertHidden}`}>
        {alert.message && (
          <Alert
            message={alert.message}
            type={alert.type}
            showIcon
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}
      </div>
      <main className={LoginStyle.Wrapper}>
        <h2>Eduhub</h2>
        <section className={FormStyle.LoginSignupFormContainer}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className={FormStyle.FormGroup}>
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={FormStyle.FormGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={FormStyle.SubmitBtn}>
              Login
            </button>
          </form>
          <p className={FormStyle.FormFooter}>
            Don&apos;t have an account? <Link to="/signup">Sign up here</Link>.
          </p>
        </section>
        <footer className={LoginStyle.Footer}>
            <p><Link to="/">EduHub</Link> &copy; 2024. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
};

export default Login;
