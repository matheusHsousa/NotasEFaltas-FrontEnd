import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("ALUNO");
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunoId, setAlunoId] = useState("");
  const [alunoId2, setAlunoId2] = useState("");
  const [disciplinaId, setDisciplinaId] = useState("");
  const [disciplinaId2, setDisciplinaId2] = useState("");


  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get("http://localhost:8800/getAllAlunos");
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      }
    };

    fetchAlunos();
  }, []);

  const DisciplinasNaoVinculadas = (aluno) => {
    console.log(aluno);
    axios
      .post("http://localhost:8800/getDisciplinasNaoVinculadasAoAluno", {
        id: aluno,
      })
      .then((response) => {
        setDisciplinas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const DisciplinasVinculadas = (aluno) => {
    console.log(aluno);
    axios
      .post("http://localhost:8800/getDisciplinasVinculadasAoAluno", {
        id: aluno,
      })
      .then((response) => {
        setDisciplinas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleCadastroAluno = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/cadastroDeUsuario",
        {
          nome,
          login,
          senha,
          role,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  };

  const handleAssociacao = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/associarUsuarioDisciplina",
        {
          alunoId,
          disciplinaId,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao associar aluno à disciplina:", error);
    }
  };

  const handleRemocao = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/removerAssociacaoUsuarioDisciplina",
        {
          alunoId2,
          disciplinaId2,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao associar aluno à disciplina:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div className="admin-container">
      <nav className="navbar navbar-expand-lg bg-body-tertiary nav-container">
        <div className="container-fluid">
          <a className="navbar-brand font-white" href="#">
            Notas e Faltas (Admin)
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse icon-perfil"
            id="navbarScroll"
          >
            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle font-icon"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/prof">
                      Area do professor
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/"
                      onClick={handleLogout}
                    >
                      Sair
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container-admin">
        <div className="card-admin">
          <h2>Criar Aluno</h2>
          <form onSubmit={handleCadastroAluno} className="form-admin">
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Login:</label>
              <input
                type="text"
                className="form-control"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Senha:</label>
              <input
                type="password"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ALUNO">Aluno</option>
                <option value="PROFESSOR">Professor</option>
              </select>
            </div>
            <div className="alinhar-fim">
              <button type="submit" className="btn btn-primary">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
        <div className="card-admin">
          <h2>Associar Aluno à Disciplina</h2>
          <form onSubmit={handleAssociacao} className="form-admin">
            <div className="form-group">
              <label>Aluno:</label>
              <select
                className="form-select"
                value={alunoId}
                onChange={(e) => {
                  const aluno = e.target.value;
                  setAlunoId(aluno);
                  DisciplinasNaoVinculadas(aluno);
                }}
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Disciplina:</label>
              <select
                className="form-select"
                value={disciplinaId}
                onChange={(e) => setDisciplinaId(e.target.value)}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="alinhar-fim">
              <button type="submit" className="btn btn-primary">
                Associar
              </button>
            </div>
          </form>
        </div>
        <div className="card-admin">
          <h2>Remover Aluno da Disciplina</h2>
          <form onSubmit={handleRemocao} className="form-admin">
            <div className="form-group">
              <label>Aluno:</label>
              <select
                className="form-select"
                value={alunoId2}
                onChange={(e) => {
                  const aluno = e.target.value;
                  setAlunoId2(aluno);
                  DisciplinasVinculadas(aluno);
                }}
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Disciplina:</label>
              <select
                className="form-select"
                value={disciplinaId2}
                onChange={(e) => setDisciplinaId2(e.target.value)}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="alinhar-fim">
              <button type="submit" className="btn btn-remover">
                Remover
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
