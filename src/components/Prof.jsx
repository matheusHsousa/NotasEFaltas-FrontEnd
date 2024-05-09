import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const Prof = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [selectedAluno, setSelectedAluno] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [alunoInfo, setAlunoInfo] = useState(null);
  const [modalAbertoFaltas, setModalAbertoFaltas] = useState(false);
  const [modalAbertoNotas, setModalAbertoNotas] = useState(false);

  const [novaNota, setNovaNota] = useState({ nome: "", valor: "" });
  const [novaFalta, setNovaFalta] = useState({ nome: "", valor: "" });

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    const userData = JSON.parse(userDataString);

    axios
      .post("http://localhost:8800/getMateriasDoProfessor", {
        id: userData.id,
      })
      .then((response) => {
        setDisciplinas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleTurmaChange = (selectedValue) => {
    const userDataString = localStorage.getItem("userData");
    const userData = JSON.parse(userDataString);
    axios
      .post("http://localhost:8800/getAlunosDaDisciplina", {
        id: selectedValue,
        Profid: userData.id,
      })
      .then((response) => {
        setAlunos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handlePesquisar = () => {
    axios
      .post("http://localhost:8800/getNotasEFaltasById", {
        alunoId: selectedAluno,
        disciplinaId: selectedDisciplina,
      })
      .then((response) => {
        const { notas, faltas } = response.data[0];

        const notasArray = Object.entries(notas).map(([nome, valor]) => ({
          nome: nome,
          valor: valor,
        }));

        const alunoData = {
          notas: notasArray,
          faltas: faltas,
          media: calcularMedia(notas),
        };

        setAlunoInfo(alunoData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAdicionarNotas = () => {
    setModalAbertoNotas(true);
  };

  const handleAdicionarFaltas = () => {
    setModalAbertoFaltas(true);
  };
  const fecharModalNotas = () => {
    setModalAbertoNotas(false);
  };

  const fecharModalFaltas = () => {
    setModalAbertoFaltas(false);
  };
  const handleSalvarNota = () => {
    axios
      .post("http://localhost:8800/setNota", {
        alunoId: selectedAluno,
        disciplinaId: selectedDisciplina,
        nomeNota: novaNota.nome,
        valorNota: novaNota.valor,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setModalAbertoNotas(false);
    handlePesquisar();
  };

  const handleSalvarFalta = () => {
    console.log(novaFalta);
    axios
      .post("http://localhost:8800/setFalta", {
        alunoId: selectedAluno,
        disciplinaId: selectedDisciplina,
        falta: novaFalta.falta,
        dataFalta: novaFalta.dataFalta,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setModalAbertoFaltas(false);
    handlePesquisar();
  };

  const calcularMedia = (notas) => {
    const valoresNotas = Object.values(notas);
    const totalNotas = valoresNotas.length;
    const somaNotas = valoresNotas.reduce((acc, nota) => acc + nota, 0);
    const media = totalNotas > 0 ? somaNotas / totalNotas : 0;
    return media.toFixed(1);
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary nav-container">
        <div className="container-fluid">
          <a className="navbar-brand font-white" href="#">
            Notas e Faltas (Professor)
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
                    <a className="dropdown-item" href="/admin">
                      Admin
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
      <div className="card-prof">
        <div className="card-select">
          <div className="wdt-50">
            <label>Disciplinas</label>
            <select
              className="select"
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedDisciplina(selectedValue);
                handleTurmaChange(selectedValue);
              }}
              value={selectedDisciplina}
            >
              <option value="">Selecione uma disciplina</option>
              {disciplinas.map((disciplina, index) => (
                <option key={index} value={disciplina.id}>
                  {disciplina.nome}
                </option>
              ))}
            </select>
          </div>
          {selectedDisciplina && (
            <div className="wdt-50">
              <label>Alunos</label>
              <select
                className="select"
                value={selectedAluno}
                onChange={(e) => setSelectedAluno(e.target.value)}
              >
                <option value="">Selecione um aluno</option>
                {alunos.map((aluno, index) => (
                  <option key={index} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="actions">
          <button
            className="btn-pesquisar"
            disabled={!selectedDisciplina || !selectedAluno}
            onClick={handlePesquisar}
          >
            Pesquisar
          </button>
          <Button
            className="btn-adicionar"
            disabled={!selectedDisciplina || !selectedAluno}
            onClick={handleAdicionarNotas}
          >
            Adicionar Notas
          </Button>
          <Button
            className="btn-adicionar"
            disabled={!selectedDisciplina || !selectedAluno}
            onClick={handleAdicionarFaltas}
          >
            Adicionar Faltas
          </Button>
          <Modal show={modalAbertoNotas} onHide={fecharModalNotas}>
            <Modal.Header closeButton>
              <Modal.Title>Adicionar/Remover Notas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container-modal-notas">
                <div className="actions-modal">
                  <label>Nome da Nota:</label>
                  <input
                    className="input-style"
                    type="text"
                    value={novaNota.nome}
                    onChange={(e) =>
                      setNovaNota({ ...novaNota, nome: e.target.value })
                    }
                  />
                </div>
                <div className="actions-modal">
                  <label>Valor da Nota:</label>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-remover">
                        Para remover digite remover
                      </Tooltip>
                    }
                  >
                    <input
                      className="input-style"
                      value={novaNota.valor}
                      onChange={(e) =>
                        setNovaNota({ ...novaNota, valor: e.target.value })
                      }
                    />
                  </OverlayTrigger>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={fecharModalNotas}>
                Fechar
              </Button>
              <Button variant="primary" onClick={handleSalvarNota}>
                Salvar Nota
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={modalAbertoFaltas} onHide={fecharModalFaltas}>
            <Modal.Header closeButton>
              <Modal.Title>Adicionar Faltas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container-modal-faltas">
                <div className="actions-modal">
                  <label>Quantidade de Faltas:</label>
                  <input
                    className="input-style"
                    type="number"
                    value={novaFalta.falta}
                    onChange={(e) =>
                      setNovaFalta({ ...novaFalta, falta: e.target.value })
                    }
                  />
                </div>
                <div className="actions-modal">
                  <label>Data da Falta:</label>
                  <input
                    className="input-style"
                    type="date"
                    value={novaFalta.dataFalta}
                    onChange={(e) =>
                      setNovaFalta({ ...novaFalta, dataFalta: e.target.value })
                    }
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={fecharModalFaltas}>
                Fechar
              </Button>
              <Button variant="primary" onClick={handleSalvarFalta}>
                Salvar Falta
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      {alunoInfo && (
        <div className="aluno-info">
          <h4>Informações de {alunoInfo.nome}</h4>
          <div className="info-notas">
            <p className="nota-nome "> Notas: </p>
            <div className="border-to-info">
              {alunoInfo.notas.map((nota, index) => (
                <p key={index}>
                  {nota.nome}: {nota.valor || "0"}
                </p>
              ))}
            </div>
          </div>
          <div className="info-notas">
            <p className="nota-nome ">Faltas:</p>
            <div className="border-to-info">
              <p>{alunoInfo.faltas || "0"}</p>
            </div>
          </div>
          <div className="info-notas">
            <p className="nota-nome "> Média: </p>
            <div className="border-to-info">
              <p>{alunoInfo.media || "0"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prof;
