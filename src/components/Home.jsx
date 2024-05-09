import React from "react";
import axios from "axios";

const Card = ({ disciplina, notas, faltas }) => {
  return (
    <div className="card-container">
      <h5 className="titulo-disciplina ">{disciplina}</h5>
      <div className="notas-e-faltas-div">

        <div className="lista">
          {Object.keys(notas).map((nome_nota, index) => (
            <div className="nota-e-media" key={index}>
              <p className="nota-nome">{nome_nota}</p>
              <p className="nota-valor">{notas[nome_nota]}</p>
            </div>
          ))}
        </div>

        <div>
          <p>Faltas: {faltas}</p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    const userData = JSON.parse(userDataString);

    axios
      .post("http://localhost:8800/getNotasFaltas", {
        id: userData.id,
      })
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary nav-container">
        <div className="container-fluid">
          <a className="navbar-brand font-white" href="#">
            Notas e Faltas (Aluno)
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
                    <a className="dropdown-item" href="#">
                      Perfil
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

      <div className="container-do-card">
          {tasks.map((task, index) => (
            <div className="col-md" key={index}>
              <Card
                disciplina={task.nome}
                notas={task.notas}
                faltas={task.faltas}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
