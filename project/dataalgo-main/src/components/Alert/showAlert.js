export const showAlert = (setAlert, setAlertVisible, type, message) => {
    setAlert({ type, message });
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };