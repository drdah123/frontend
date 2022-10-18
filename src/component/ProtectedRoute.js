import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../Store';

const ProtectedRoute = ({ children }) => {
  const { state } = useStateContext();
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
