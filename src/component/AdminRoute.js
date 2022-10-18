import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../Store';

const AdminRoute = ({ children }) => {
  const { state } = useStateContext();
  const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
};

export default AdminRoute;
