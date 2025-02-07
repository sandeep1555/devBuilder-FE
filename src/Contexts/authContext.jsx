import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [tokenExpireTime, setTokenExpireTime] = useState(localStorage.getItem('tokenExpireTime') || null);
  const [refreshTokenExpireTime, setRefreshTokenExpireTime] = useState(localStorage.getItem('refreshTokenExpireTime') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  const logoutExpireTime = () => {
    const token = localStorage.getItem('acessToken');
    const tokenExpiryTime = localStorage.getItem('expiryTime');

    // if (token && tokenExpiryTime) {
    //   const currentTime = Math.floor(Date.now() / 1000);
    //   if (currentTime > tokenExpiryTime) {
    //     logOut();
    //   }
    // }
  }

  const logIn = (newAccessToken, newtokenExpireTime, role = null) => {
    setAccessToken(newAccessToken);
    setTokenExpireTime(newtokenExpireTime);
    setRole(role)
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('tokenExpireTime', newtokenExpireTime);
    localStorage.setItem('expiryTime', tokenExpireTime);
    localStorage.setItem('role', role);
  };

  const logOut = () => {
    setAccessToken(null);
    setTokenExpireTime(null);
    setRefreshTokenExpireTime(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpireTime');
    localStorage.removeItem('expiryTime');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  const getAccessToken = () => {
    return accessToken;
  }

  const getRole = () => {
    return role;
  }

  const isLoggedIn = () => {
    return accessToken ? true : false;

  }

  return (
    <AuthContext.Provider value={{ logIn, logOut, getAccessToken, isLoggedIn, logoutExpireTime, getRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};