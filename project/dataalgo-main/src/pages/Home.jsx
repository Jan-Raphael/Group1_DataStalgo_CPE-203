import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow, differenceInYears } from 'date-fns';
import axios from 'axios';

import { GetCookie } from '../components/auth/cookies.jsx';
import { Button, Modal } from 'antd';
import UpArrow from '../assets/images/arrow-big-up.svg';
import DownArrow from '../assets/images/arrow-big-down.svg';

import HomeStyle from '../assets/styles/home.module.css';
import PostModel from '../assets/styles/PostModel.module.css';
import ModalStyle from '../assets/styles/modal.module.css';

import AlertComponent from '../components/Alert/AlertComponent.jsx';
import { showAlert } from '../components/Alert/ShowAlert.js';

const Home = () => {
  const navigate = useNavigate();
  const [LoggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showAttachments, setShowAttachments] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetchPosts();
    console.log('userData:', GetCookie('data'));
    console.log('posts:', posts);
    const userData = GetCookie('data');
    if (userData && userData.id && userData.token) {
      setLoggedIn(true);
      setUserId(userData.id);
    }
  },[]);

  const fetchPosts = () => {
    axios.get('http://localhost:8000/api/posts/')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Error fetching posts:', err));
  };

  const handleVote = async (postId, type) => {
    const userData = GetCookie('data');
    if (!userData) return showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');

    try {
      const res = await axios.post(`http://localhost:8000/api/posts/${postId}/${type}/`, {}, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      setPosts(prev => prev.map(p => p.id === postId ? res.data : p));
    } catch (err) {
      console.error(`${type} error:`, err);
    }
  };

  const handlePurchase = async (postId, price) => {
    const userData = GetCookie('data');
    if (!userData) return showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');

    try {
      const res = await axios.post(`http://localhost:8000/api/posts/purchase/${postId}/`, {}, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      if (res.data?.message === 'Insufficient balance') {
        return showAlert(setAlert, setAlertVisible, 'error', 'Insufficient balance!');
      }
      setPosts(prev => prev.map(p => p.id === postId ? res.data : p));
      showAlert(setAlert, setAlertVisible, 'success', 'Purchase successful!');
    } catch (err) {
      console.error('Purchase error:', err);
    }
  };

  const downloadAttachment = async (postId, filename) => {
    const userData = GetCookie('data');
    if (!userData) return showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');

    try {
      const res = await axios.post(`http://localhost:8000/api/posts/download/`, {
        PostId: postId,
        Filename: filename
      }, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${userData.token}` }
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showAlert(setAlert, setAlertVisible, 'error', 'You are not authorized to download this file.');
    }
  };

  const toggleAttachments = id => {
    setShowAttachments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getClassName = type => type === 1 ? PostModel.PostSubscription : type === 2 ? PostModel.PostPremium : '';

  return (
    <>
      <AlertComponent alert={alert} setAlert={setAlert} alertVisible={alertVisible} />
      <main className={HomeStyle.HomeContent}>
        {posts.length === 0 ? (
          <div className={PostModel.Post}><p>No posts available</p></div>
        ) : posts.map(post => (
          <div key={post.id} className={`${PostModel.Post} ${getClassName(post.contentType)}`}>
            <div className={PostModel.PostHeader}>
              <h2 className={PostModel.PostTitle}>{post.title}</h2>
              <span className={PostModel.PostTimestamp}>
                {differenceInYears(new Date(), new Date(post.PostDate)) >= 1
                  ? format(new Date(post.PostDate), 'MMMM d, yyyy')
                  : formatDistanceToNow(new Date(post.PostDate), { addSuffix: true })}
              </span>
            </div>
  
            <p className={PostModel.PostTags}>Tags: {post.tags}</p>
  
            <p className={PostModel.PostAuthor}>
              Posted by
              <img
                src={`http://localhost:8000/api/accounts/avatar/${post.userId}/`}
                className={PostModel.PostAuthorIcon}
                alt="User"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/vite.svg';
                }}
              />
              <Link to={`/profile/${post.username}`} className={PostModel.PostAuthorName}>{post.username}</Link>
            </p>
  
            <p>{post.description}</p>
  
            {post.AttachmentCount > 0 && (
              <>
                <button className={PostModel.ShowMoreButton} onClick={() => toggleAttachments(post.id)}>
                  {showAttachments[post.id] ? 'Hide Attachments' : 'Show Attachments'}
                </button>
                {showAttachments[post.id] && Array.isArray(post.attachments) && post.attachments.map((a, i) => (
                  <button key={i} className={PostModel.PostDownloadButton} onClick={() => downloadAttachment(post.id, a)}>
                    📎 {a}
                  </button>
                ))}
              </>
            )}
  
            {post.contentType === 1 && Array.isArray(post.subscribers) && !post.subscribers.includes(userId) && post.userId !== userId && (
              <button className={PostModel.PostActionsButton} onClick={() => navigate(`/profile/${post.username}`)}>Subscribe</button>
            )}
  
            {post.contentType === 2 && Array.isArray(post.purchase) && !post.purchase.includes(userId) && post.userId !== userId && (
              <>
                <p className={PostModel.PostPrice}>${post.price.toFixed(2)}</p>
                <button className={PostModel.PostActionsButton} onClick={() => handlePurchase(post.id, post.price)}>Buy Now</button>
              </>
            )}
  
            <div className={PostModel.PostActions}>
              <button
                onClick={() => handleVote(post.id, 'upvote')}
                className={`${PostModel.PostActionsButton} ${PostModel.ButtonVote} ${Array.isArray(post.upvotes) && post.upvotes.includes(userId) ? PostModel.ButtonVoted : ''}`}
              >
                <img src={UpArrow} alt="Upvote" />
              </button>
              <p>{(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}</p>
              <button
                onClick={() => handleVote(post.id, 'downvote')}
                className={`${PostModel.PostActionsButton} ${PostModel.ButtonVote} ${Array.isArray(post.downvotes) && post.downvotes.includes(userId) ? PostModel.ButtonVoted : ''}`}
              >
                <img src={DownArrow} alt="Downvote" />
              </button>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}  

export default Home;
