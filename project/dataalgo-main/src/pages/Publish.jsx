import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

// Custom Components
import { GetCookie, RemoveCookie } from '../components/auth/cookies.jsx';

//CSS & Alert Components
import PublishStyle from "../assets/styles/publish.module.css";
import FormStyle from "../assets/styles/form.module.css";
import AlertComponent from '../components/Alert/AlertComponent.jsx';
import { showAlert } from '../components/Alert/ShowAlert.js';

const Publish = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [isPaid, setIsPaid] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [hasAttachment, setHasAttachments] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const userData = GetCookie('data');
    if (!userData) navigate('/');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = GetCookie('data');
    if (!userData) return navigate('/');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('contentType', contentType);
    formData.append('price', price);
    formData.append('hasAttachments', hasAttachment);
    formData.append('user', userData.id);
    formData.append('username', userData.username);

    if (attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
      }
    }

    try {
      await axios.post('http://localhost:8000/api/posts/publish/', formData, {
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showAlert(setAlert, setAlertVisible, 'success', 'Successfully published!');
      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      console.error('Publish error:', error);
      if (error.response?.status === 401) {
        showAlert(setAlert, setAlertVisible, 'error', 'Session expired. Please login again.');
        setTimeout(() => {
          RemoveCookie('data');
          navigate('/login');
        }, 1500);
      } else {
        showAlert(setAlert, setAlertVisible, 'error', 'Server error. Please try again later.');
      }
    }
  };

  const handleAttachmentsChange = (e) => {
    setAttachments(e.target.files);
    setHasAttachments(true);
  };

  return (
    <>
      <AlertComponent alert={alert} setAlert={setAlert} alertVisible={alertVisible} />
      <main className={PublishStyle.Wrapper}>
        <section className={FormStyle.PostFormContainer}>
          <h2>Create a new post</h2>
          <form onSubmit={handleSubmit}>
            <div className={FormStyle.FormGroup}>
              <label htmlFor="title">Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={FormStyle.FormGroup}>
              <label htmlFor="tags">Tags</label>
              <input type="text" required value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className={FormStyle.FormGroup}>
              <label htmlFor="attachments">Attachments</label>
              <input type="file" multiple onChange={handleAttachmentsChange} />
            </div>
            <div className={FormStyle.FormGroup}>
              <label>Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className={FormStyle.FormGroup}>
              <div className={FormStyle.CheckBox}>
                <p>Paid Content</p>
                <input type="checkbox" onChange={() => {
                  setIsPaid(!isPaid);
                  setShowPriceInput(false);
                  setContentType(0);
                }} />
              </div>
            </div>
            {isPaid && (
              <div className={FormStyle.SubPriceButton}>
                <button type="button" onClick={() => {
                  setShowPriceInput(false);
                  setContentType(1);
                }}>Subscription</button>
                <button type="button" onClick={() => {
                  setShowPriceInput(true);
                  setContentType(2);
                }}>Price base</button>
              </div>
            )}
            {showPriceInput && (
              <div className={FormStyle.FormGroup}>
                <label htmlFor="price">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            )}
            <button type="submit" className={FormStyle.SubmitBtn}>Publish</button>
          </form>
        </section>
        <footer className={PublishStyle.Footer}>
          <p><Link to="/">EduHub</Link> &copy; 2024. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
};

export default Publish;
