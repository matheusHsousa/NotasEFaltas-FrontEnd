// Login.js
import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8800/users", {
        login: username,
        password: password,
      });

      if (response.status === 200) {
        const userData = response.data;
        localStorage.setItem("userData", JSON.stringify(userData));
        setLoggedIn(true);
      } else {
        alert("Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      alert("Erro ao autenticar. Por favor, tente novamente mais tarde.");
    }
  };

  if (loggedIn) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData.role === "PROFESSOR") {
      return <Navigate to="/prof" />;
    } else if (userData.role === "ALUNO") {
      return <Navigate to="/home" />;
    }
  }

  return (
    <div className="login-container">
      <div className="login-interno">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
