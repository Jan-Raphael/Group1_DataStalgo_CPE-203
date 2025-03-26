import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, differenceInYears } from 'date-fns';
import axios from 'axios';

// Custom Components
import { GetCookie, SetCookie, RemoveCookie } from '../components/auth/cookies.jsx';

//Ant Design Components && Icons
import { Alert, Button, Input, Divider, Modal } from 'antd';
import { UserOutlined, MailOutlined, DollarOutlined } from '@ant-design/icons';

//CSS Components for styling
import SettingsStyle from '../assets/styles/settings.module.css';
import PostModel from "../assets/styles/PostModel.module.css";

//Custom alert Components
import AlertComponent from '../components/Alert/AlertComponent.jsx';
import { showAlert } from '../components/Alert/ShowAlert.js';

const Settings = () => {
  const userData = GetCookie('data');
  const username = userData ? userData.username : null;
  const token = userData?.token;

  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [subscriptionInput, setsubscriptionInput] = useState(0);

  const [selectedSection, setSelectedSection] = useState('My Account');
  const [ChangesVisibile , setChangesVisibile ] = useState(false);
  const [hasChanges, sethasChanges] = useState({ type: '', message: '' });

  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);

  const [alertVisible , setAlertVisible ] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchUserData = () => {
    axios.get(`http://localhost:8000/api/accounts/user/${username}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const data = response.data;
      setUser(data);
      setUsernameInput(data.username);
      setEmailInput(data.email);
      setsubscriptionInput(data.subscriptionprice);

      axios.get(`http://localhost:8000/api/accounts/purchased/${data.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(PurchasePostResponse => {
        setPosts(PurchasePostResponse.data);

        axios.get(`http://localhost:8000/api/accounts/subscriptions/${data.id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(SubscriptionsResponse => {
          setSubscriptions(SubscriptionsResponse.data);
        })
        .catch(error => console.error('Error fetching Subscriptions :', error));
      })
      .catch(error => console.error('Error fetching purchases:', error));
    })
    .catch(error => console.error('Error fetching userdata :', error));
  };

  useEffect(() => {
    fetchUserData();
    const handleUserDataUpdate = () => fetchUserData();
    window.addEventListener('userDataUpdate', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdate', handleUserDataUpdate);
  }, [username]);

  useEffect(() => {
    if (usernameInput !== user.username || emailInput !== user.email || Number(subscriptionInput) !== Number(user.subscriptionprice)) {
      sethasChanges({ type: 'info', message: 'You have unsaved changes.' });
      setChangesVisibile(true);
    } else {
      setChangesVisibile(false);
    }
  }, [usernameInput, emailInput, subscriptionInput, user]);

  const handleSaveChanges = () => {
    axios.post(`http://localhost:8000/api/accounts/update/information/${userData.id}/`, {
      username: usernameInput,
      email: emailInput,
      subprice: subscriptionInput,
      password: userData.password
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      showAlert(setAlert, setAlertVisible, 'success', 'Changes have been saved.');
      const data = response.data;
      RemoveCookie('data');
      const cookieData = { id: data.id, username: data.username, token: data.token, password: data.password };
      SetCookie('data', cookieData, { expires: 7, secure: true, sameSite: 'Strict' });
      setUser(data);
      setChangesVisibile(false);
    })
    .catch(error => {
      if (error.response?.status === 511) {
        showAlert(setAlert, setAlertVisible, 'error', 'Invalid credentials, logging you out in 5 seconds.');
        RemoveCookie('data');
        setTimeout(() => {
          window.location.href = '/login';
          setAlertVisible(false);
        }, 5000);
      } else if (error.response?.status === 401) {
        showAlert(setAlert, setAlertVisible, 'error', error.response.data.message);
      } else {
        showAlert(setAlert, setAlertVisible, 'error', 'Server error. Please try again later');
      }
    });
  };

  const handleResetChanges = () => {
    showAlert(setAlert, setAlertVisible, 'success', 'Changes have been reset.');
    setUsernameInput(user.username);
    setEmailInput(user.email);
    setsubscriptionInput(user.subscriptionprice);
    setChangesVisibile(false);
  };

  const handleSubscribe = async (Authorname) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/accounts/user/subscribe/`, {
        Authorname
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      window.dispatchEvent(new Event('userDataUpdate'));
      showAlert(setAlert, setAlertVisible, 'success', `Successfully Unsubscribed to ${Authorname}!`);

      const subscriptionRes = await axios.get(`http://localhost:8000/api/accounts/subscriptions/${userData.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(subscriptionRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        showAlert(setAlert, setAlertVisible, 'error', error.response.data.message);
      } else {
        console.error('Error unsubscribing:', error);
      }
    }
  };

  const getClassName = (contentType) => {
    switch (contentType) {
      case 1:
        return PostModel.PostSubscription;
      case 2:
        return PostModel.PostPremium;
      default:
        return '';
    }
  };

  // Settings Side Panel(To show the corresponding data based on the selected section)
  const renderContent = () => {
    switch (selectedSection) {
      case 'My Account':
        return (
          <>
            <div className={SettingsStyle.ProfileHeader}>
              <img src={`http://localhost:5000/avatar/${userData.id}`} alt="User" className={SettingsStyle.Avatar} />
              <div className={SettingsStyle.ProfileInfo}>
                <h1>{user.username}</h1>
                <p>{user.email}</p>
                <div className={SettingsStyle.Information}>
                  <p>Joined: {new Date(user.JoinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}</p>
                </div>
              </div>
            </div>
            <div className={SettingsStyle.ProfileForm}>

              <div>
                <div className={SettingsStyle.ProfileActions}>
                  <p>Account Information</p>
                  <Input
                    placeholder="Username"
                    prefix={<UserOutlined />}
                    style={{ width: '250px' }}
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    style={{ width: '250px' }}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
                <div className={SettingsStyle.ProfileActions}>
                  <p>Subscription Price</p>
                  <Input
                    placeholder="Price ($)"
                    prefix={<DollarOutlined />}
                    style={{ width: '250px' }}
                    value={subscriptionInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value) && value !== '0') {
                        setsubscriptionInput(value === '' ? '1' : value);
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                  <div className={SettingsStyle.ProfileActions}>
                  <p>Account control</p>
                    <Button type="primary" onClick={() => setIsChangePasswordModalVisible(true)}>Change password</Button>
                    <Button type="primary" onClick={() => setIsDeleteAccountModalVisible(true)} danger>Delete account</Button>
                  </div>
              </div>
            </div>
          </>
        );
      case 'Purchases':
        return (
          <div>
            <h2>Purchases History</h2>
            <Divider />
            <div className={SettingsStyle.PurchasesContainer}>
              {posts.length === 0 ? (
                <div className={SettingsStyle.Purchases}>
                  <h3>Purchase History</h3>
                  <p>No purchases found.</p>
                </div>
              ) : (
                <div className={SettingsStyle.Purchases}>
                  {posts.map(post => (
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
                          <img src={ `http://localhost:5000/avatar/${post.userId}`}  className={PostModel.PostAuthorIcon}alt="User" />
                          <Link to={`/profile/${post.username}`} className={PostModel.PostAuthorName}>
                            <span>{post.username}</span>
                          </Link>
                      </p>
                      <div className={PostModel.PostActions}>
                        <Button type="primary" onClick={() => window.open(`/post/${post.id}`, '_blank')}>View Post</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'Subscriptions':
        return (
          <div>
          <h2>List of Subscription</h2>
          <Divider />
          <div className={SettingsStyle.SubscriptionContainer}>
            {subscriptions.length === 0 ? (
              <div className={SettingsStyle.Purchases}>
                <h3>Subscription List</h3>
                <p>No subscription found.</p>
              </div>
            ) : (
              <>
              <div className={SettingsStyle.Subscriptions}>
              {subscriptions.map(subscription => (
                <div className={SettingsStyle.Subscriber}>
                  <img src={`http://localhost:5000/avatar/${subscription.id}`} alt="User" className={SettingsStyle.SubscriberAvatar} />
                  <div className={SettingsStyle.SubscriberInfo}>
                    <h1>{subscription.username}</h1>
                    <div className={SettingsStyle.SubscriberInfo}>
                       <p>Joined: {new Date(subscription.JoinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}</p>
                      <p>{subscription.followers.length > 1 ? `${subscription.followers.length} Followers`: `${subscription.followers.length} Follower`} • {subscription.subscribers.length > 0 ? `${subscription.subscribers.length} Subscribers`: `${subscription.subscribers.length} Subscriber`}</p>
                    </div>
                    <div className={PostModel.PostActions}>
                        <Button type="primary" onClick={() => window.open(`/profile/${subscription.username}`, '_blank')}>View Profile</Button>
                        <Button type="primary"   onClick={() => handleSubscribe(subscription.username)} danger>Unsubscribe</Button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </>
            )}
          </div>
        </div>
        );
      case 'Data & Privacy':
        return (
          <div>
            <h2>Data & Privacy</h2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AlertComponent alert={alert} setAlert={setAlert} alertVisible={alertVisible} />
      <div className={`${SettingsStyle.Alert} ${ChangesVisibile ? SettingsStyle.AlertVisible : SettingsStyle.AlertHidden}`}>
        {hasChanges.message && (
          <Alert
            message={hasChanges.message}
            type={hasChanges.type}
            action={
              <div className={PostModel.PostActions}>
                <button className={PostModel.PostDownloadButton}  onClick={handleSaveChanges}>Save</button>
                <button className={PostModel.ResetButton}  onClick={handleResetChanges}>Reset</button>
              </div>
            }
            onClose={() => sethasChanges({ type: '', message: '' })}
          />
        )}
      </div>

      <div className={SettingsStyle.SettingsPage}>
        <div className={SettingsStyle.Sidebar}>
          <div className={SettingsStyle.SliderTitleHolder}>
              <h3>User Settings</h3>
          </div>
          <ul>
            <li className={selectedSection === 'My Account' ? SettingsStyle.Selected : ''} onClick={() => setSelectedSection('My Account')}>My Account</li>
            <li className={selectedSection === 'Purchases' ? SettingsStyle.Selected : ''} onClick={() => setSelectedSection('Purchases')}>Purchases</li>
            <li className={selectedSection === 'Subscriptions' ? SettingsStyle.Selected : ''} onClick={() => setSelectedSection('Subscriptions')}>Subscriptions</li>
            <li className={selectedSection === 'Data & Privacy' ? SettingsStyle.Selected : ''} onClick={() => setSelectedSection('Data & Privacy')}>Data & Privacy</li>
          </ul>
        </div>
        <div className={SettingsStyle.ContentHolder}>
          {renderContent()}
        </div>
      </div>

      <Modal
        title="Change Password"
        open={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsChangePasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            Submit
          </Button>,
        ]}
      >
        <p>Change password form goes here...</p>
      </Modal>

      <Modal
        title="Delete Account"
        open={isDeleteAccountModalVisible}
        onCancel={() => setIsDeleteAccountModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteAccountModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" danger>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default Settings;