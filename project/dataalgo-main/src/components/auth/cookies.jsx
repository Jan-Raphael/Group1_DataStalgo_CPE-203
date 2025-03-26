import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const secretKey = '3f9aa08a50de6e1749090b8228901626b434f518014778c83ab4830449c578e0'; // Secret key for encryption for cookies

export const SetCookie = (name, data, options) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  Cookies.set(name, encryptedData, options);
};

export const GetCookie = (name) => {
    const encryptedData = Cookies.get(name);
    if (!encryptedData) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      Cookies.remove(name);
      return null;
    }
};

export const RemoveCookie = (name) => {
    try {
      Cookies.remove(name);
    } catch (error) {
      return null;
    }
};