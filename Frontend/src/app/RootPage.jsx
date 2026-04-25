import React from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import Welcome from '../Features/Auth/pages/Welcome';

/**
 * RootPage — Smart entry point
 * - Already logged-in user → seedha /home pe bhejo
 * - New / guest user → Welcome page dikhao
 */
const RootPage = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  if (user) return <Navigate to="/home" replace />;

  return <Welcome />;
};

export default RootPage;
