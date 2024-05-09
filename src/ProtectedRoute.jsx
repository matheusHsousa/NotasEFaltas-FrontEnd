// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  if (!element) {
    return null; // Retorna null se element não estiver definido
  }

  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    return <Navigate to="/login" />;
  }

  const { role } = userData;

  if (role === "ALUNO" && element.props.path === "/prof") {
    return <Navigate to="/home" />;
  }

  if (role === "PROFESSOR" && element.props.path === "/home") {
    return <Navigate to="/prof" />;
  }

  return element;
};

export default ProtectedRoute;
