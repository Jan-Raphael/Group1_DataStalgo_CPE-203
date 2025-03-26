import React from 'react';

//Ant Design Components
import { Alert } from 'antd';
import AlertStyle from './alert.module.css';

const AlertComponent = ({ alert, setAlert, alertVisible }) => {
  return (
    <div className={`${AlertStyle.Alert} ${alertVisible ? AlertStyle.AlertVisible : AlertStyle.AlertHidden}`}>
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          showIcon
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}
    </div>
  );
};

export default AlertComponent;