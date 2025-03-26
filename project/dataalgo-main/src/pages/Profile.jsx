import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow, differenceInYears } from 'date-fns';
import axios from 'axios';

// Custom Components
import { GetCookie } from '../components/auth/cookies.jsx';

// Ant Design & UI
import { Button, Modal } from 'antd';
import UpArrow from "../assets/images/arrow-big-up.svg";
import DownArrow from "../assets/images/arrow-big-down.svg";

// Styling
import ProfileStyle from '../assets/styles/profile.module.css';
import PostModel from "../assets/styles/PostModel.module.css";
import ModalStyle from "../assets/styles/modal.module.css";

// Alerts
import AlertComponent from '../components/Alert/AlertComponent.jsx';
import { showAlert } from '../components/Alert/ShowAlert.js';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userIdMe, setUserIdMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showAttachments, setShowAttachments] = useState({});
  const [SubscribeModal, setSubscribeModal] = useState(false);
  const [SubscribeModalContent, setSubscribeModalContent] = useState(null);
  const [PremiumModal, setPremiumModal] = useState(false);
  const [PremiumModalContent, setPremiumModalContent] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [alertVisible, setAlertVisible] = useState(false);

  const userData = GetCookie('data');
  const token = userData?.token;

  useEffect(() => {
    if (userData) setUserIdMe(userData.id);
  }, []);

  const fetchProfileAndPosts = async () => {
    try {
      const profileRes = await axios.get(`http://localhost:8000/api/accounts/user/${username}/`);
      setUser(profileRes.data);
      const postRes = await axios.get(`http://localhost:8000/api/posts/user/${profileRes.data.id}/`);
      setPosts(postRes.data);
    } catch (err) {
      console.error("Fetch profile error:", err);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchProfileAndPosts();
  }, [username]);

  const handleAction = async (url, data, successMessage, callback) => {
    if (!token) return showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');
    try {
      const res = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (successMessage) showAlert(setAlert, setAlertVisible, 'success', successMessage);
      if (callback) callback(res.data);
    } catch (error) {
      console.error('Action error:', error);
      if (error.response?.data?.message) {
        showAlert(setAlert, setAlertVisible, 'error', error.response.data.message);
      }
    }
  };

  const handleFollow = () => {
    handleAction('http://localhost:8000/api/accounts/follow/', { Authorname: user.username }, null, setUser);
  };

  const handleSubscribe = (Authorname, Checker) => {
    handleAction('http://localhost:8000/api/accounts/subscribe/', { Authorname }, `Subscribed to ${Authorname}`, updated => {
      setUser(updated);
      setSubscribeModal(false);
      fetchProfileAndPosts();
    });
  };

  const handleVote = (postId, type) => {
    handleAction(`http://localhost:8000/api/posts/${postId}/${type}/`, {}, null, updated => {
      setPosts(prev => prev.map(p => (p.id === postId ? updated : p)));
    });
  };

  const handlePurchase = (postId, price) => {
    handleAction(`http://localhost:8000/api/posts/purchase/${postId}/`, {}, 'Purchase successful!', updated => {
      setPosts(prev => prev.map(p => (p.id === postId ? updated : p)));
      setPremiumModal(false);
      window.dispatchEvent(new Event('userDataUpdate'));
    });
  };

  const DownloadContent = async (PostId, Filename) => {
    if (!token) return showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');
    try {
      const response = await axios.post(`http://localhost:8000/api/posts/download/`, {
        PostId, Filename
      }, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', Filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      if (error.response?.status === 401) {
        showAlert(setAlert, setAlertVisible, 'error', 'You do not have access to this content.');
      } else {
        console.error('Download error:', error);
      }
    }
  };

  const toggleAttachments = postId => {
    setShowAttachments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getClassName = (contentType) => {
    return contentType === 1 ? PostModel.PostSubscription : contentType === 2 ? PostModel.PostPremium : '';
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <AlertComponent alert={alert} setAlert={setAlert} alertVisible={alertVisible} />
      <div className={ProfileStyle.ProfileContainer}>
        <div className={ProfileStyle.ProfileHeader}>
          <img src={`http://localhost:8000/api/accounts/avatar/${user.id}/`} alt="User" className={ProfileStyle.ProfileAvatar} />
          <div className={ProfileStyle.ProfileInfo}>
            <h1>{user.username}</h1>
            <div className={ProfileStyle.Information}>
              <p>Joined: {new Date(user.JoinDate).toLocaleDateString('en-US')}</p>
              <p>{user.followers?.length || 0} Followers • {user.subscribers?.length || 0} Subscribers • {posts.length} Posts</p>
            </div>
            {user.id !== userIdMe && (
              <div className={ProfileStyle.ProfileActions}>
                <button onClick={handleFollow} className={ProfileStyle.ProfileActionsFollowButton}>
                  {user.followers?.includes(userIdMe) ? 'Unfollow' : 'Follow'}
                </button>
                {Number(user.subscriptionprice) > 0 && (
                  <button className={ProfileStyle.ProfileActionsSubscribeButton} onClick={() =>
                    user.subscribers.includes(userIdMe)
                      ? handleSubscribe(user.username, false)
                      : setSubscribeModal(true) || setSubscribeModalContent({ AuthorName: user.username, AuthorId: user.id, SubscriptionPrice: user.subscriptionprice, Checker: true })
                  }>
                    {user.subscribers.includes(userIdMe)
  ? 'Unsubscribe'
  : `Subscribe for $${Number(user.subscriptionprice).toFixed(2)}`}

                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={ProfileStyle.ProfilePosts}>
          <h2>Posts</h2>
          {posts.length === 0 ? <p>No posts available</p> : (
            posts.map(post => (
              <section key={post.id} className={`${PostModel.Post} ${getClassName(post.contentType)}`}>
                <div className={PostModel.PostHeader}>
                  <h2>{post.title}</h2>
                  <span className={PostModel.PostTimestamp}>
                    {differenceInYears(new Date(), new Date(post.PostDate)) >= 1
                      ? format(new Date(post.PostDate), 'MMMM d, yyyy')
                      : formatDistanceToNow(new Date(post.PostDate), { addSuffix: true })}
                  </span>
                </div>
                <p className={PostModel.PostTags}>Tags: {post.tags}</p>
                <p className={PostModel.PostAuthor}>
                  Posted by
                  <img src={`http://localhost:8000/api/accounts/avatar/${post.userId}/`} className={PostModel.PostAuthorIcon} alt="User" />
                  <Link to={`/profile/${post.username}`} className={PostModel.PostAuthorName}>{post.username}</Link>
                </p>

                {(() => {
                  const hasAccess = post.contentType === 0 || post.userId === userIdMe ||
                    (post.contentType === 1 && post.subscribers.includes(userIdMe)) ||
                    (post.contentType === 2 && post.purchase.includes(userIdMe));

                  return hasAccess ? (
                    <>
                      <p>{post.description}</p>
                      {post.AttachmentCount > 0 && (
                        <div className={PostModel.ContentPost}>
                          <p className={PostModel.ContentTitle}>Post Attachments</p>
                          <button onClick={() => toggleAttachments(post.id)} className={PostModel.ShowMoreButton}>
                            {showAttachments[post.id] ? 'Hide Attachments' : 'Show Attachments'}
                          </button>
                          {showAttachments[post.id] && JSON.parse(post.attachments).map((a, i) => (
                            <button key={i} className={PostModel.PostDownloadButton} onClick={() => DownloadContent(post.id, a)}>
                              📎 {a}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={PostModel.LockedContainer}>
                      <p>This content is locked.</p>
                      {post.contentType === 1 ? (
                        <button className={PostModel.PostActionsButton} onClick={() => setSubscribeModal(true) || setSubscribeModalContent({ AuthorName: post.username, AuthorId: post.userId, SubscriptionPrice: user.subscriptionprice, Checker: true })}>Subscribe</button>
                      ) : (
                        <>
                          <p className={PostModel.PostPrice}>${post.price.toFixed(2)}</p>
                          <button className={PostModel.PostActionsButton} onClick={() => setPremiumModal(true) || setPremiumModalContent({ PostId: post.id, PostPrice: post.price, PostTitle: post.title, AuthorId: post.userId, AuthorName: post.username })}>Buy Now</button>
                        </>
                      )}
                    </div>
                  );
                })()}

                <div className={PostModel.PostActions}>
                  <button onClick={() => handleVote(post.id, 'upvote')} className={`${PostModel.PostActionsButton} ${post.upvotes.includes(userIdMe) ? PostModel.ButtonVoted : ''}`}>
                    <img src={UpArrow} alt="Upvote" />
                  </button>
                  <p>{post.upvotes.length - post.downvotes.length}</p>
                  <button onClick={() => handleVote(post.id, 'downvote')} className={`${PostModel.PostActionsButton} ${post.downvotes.includes(userIdMe) ? PostModel.ButtonVoted : ''}`}>
                    <img src={DownArrow} alt="Downvote" />
                  </button>
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* Premium Modal */}
      <Modal open={PremiumModal} onCancel={() => setPremiumModal(false)} title="Purchase Content" footer={[
        <Button onClick={() => setPremiumModal(false)}>Cancel</Button>,
        <Button type="primary" onClick={() => handlePurchase(PremiumModalContent?.PostId, PremiumModalContent?.PostPrice)}>Confirm</Button>
      ]}>
        <div className={ModalStyle.Post}>
          <p className={ModalStyle.ModalTitle}>{PremiumModalContent?.PostTitle}</p>
          <p>Posted by: <strong>{PremiumModalContent?.AuthorName}</strong></p>
          <div>Price: <strong>${PremiumModalContent?.PostPrice}</strong></div>
          <p>Do you want to purchase this content?</p>
        </div>
      </Modal>

      {/* Subscription Modal */}
      <Modal open={SubscribeModal} onCancel={() => setSubscribeModal(false)} title="Subscription" footer={[
        <Button onClick={() => setSubscribeModal(false)}>Cancel</Button>,
        <Button type="primary" onClick={() => handleSubscribe(SubscribeModalContent?.AuthorName, SubscribeModalContent?.Checker)}>Confirm</Button>
      ]}>
        <div className={ModalStyle.Post}>
          <p className={ModalStyle.ModalTitle}>Subscribe to {SubscribeModalContent?.AuthorName}</p>
          <div>Price: <strong>${SubscribeModalContent?.SubscriptionPrice}</strong></div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
