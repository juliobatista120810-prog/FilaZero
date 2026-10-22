import React, { useState } from 'react';
import { QRCodeSVG } from './QRCodeSVG';
import './Main.css';

// Lê a lista de alunos salva no navegador
function carregarAlunos() {
  try {
    return JSON.parse(localStorage.getItem('alunos')) || [];
  } catch {
    return [];
  }
}

// Salva a lista de alunos no navegador
function salvarAlunos(lista) {
  localStorage.setItem('alunos', JSON.stringify(lista));
}

function Main() {
  // Controla qual tela aparece
  const [modo, setModo] = useState('cadastro');

  // Lista com TODOS os alunos cadastrados
  const [alunos, setAlunos] = useState(carregarAlunos);

  // Aluno que está logado agora (null = ninguém)
  const [alunoLogado, setAlunoLogado] = useState(null);

  // Guarda o que está sendo digitado no cadastro
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  // Guarda os dados digitados no login
  const [login, setLogin] = useState({
    email: '',
    senha: ''
  });

  // Faz o cadastro do aluno
  function cadastrar(e) {
    e.preventDefault();

    // Confere se todos os campos foram preenchidos
    if (!formulario.nome || !formulario.email || !formulario.senha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (formulario.senha.length < 8) {
      alert('A senha precisa ter 8 caracteres ou mais!');
      return;
    }

    // Não deixa cadastrar o mesmo e-mail duas vezes
    const emailJaExiste = alunos.some(
      (a) => a.email.toLowerCase() === formulario.email.toLowerCase()
    );
    if (emailJaExiste) {
      alert('Esse e-mail já está cadastrado!');
      return;
    }

    // Cada aluno recebe um id único, que vira o QR Code da carteirinha
    const novoAluno = {
      ...formulario,
      id: crypto.randomUUID()
    };

    const novaLista = [...alunos, novoAluno];
    setAlunos(novaLista);
    salvarAlunos(novaLista);

    setAlunoLogado(novoAluno);
    setFormulario({ nome: '', email: '', senha: '' });
  }

  // Confere os dados do login procurando na lista de alunos
  function entrar(e) {
    e.preventDefault();

    const encontrado = alunos.find(
      (a) =>
        a.email.toLowerCase() === login.email.toLowerCase() &&
        a.senha === login.senha
    );

    if (encontrado) {
      setAlunoLogado(encontrado);
      setLogin({ email: '', senha: '' });
    } else {
      alert('E-mail ou senha incorretos!');
    }
  }

  // Mostra a carteirinha do aluno que entrou
  if (alunoLogado) {
    // Conteúdo do QR Code: identifica o aluno sem expor a senha
    const conteudoQR = JSON.stringify({
      id: alunoLogado.id,
      nome: alunoLogado.nome
    });

    return (
      <div className="carteirinha">
        <h2>SENAI Fila Zero</h2>
        <h3>Carteirinha Digital</h3>

        <p>
          <strong>Nome:</strong> {alunoLogado.nome}
        </p>

        <p>
          <strong>E-mail:</strong> {alunoLogado.email}
        </p>

        <p>
          <strong>Nº da carteirinha:</strong>{' '}
          {alunoLogado.id.slice(0, 8).toUpperCase()}
        </p>

        {/* QR Code único de cada aluno */}
        <QRCodeSVG value={conteudoQR} size={180} />

        <p>Apresente o QR Code para retirar seu lanche.</p>

        <button
          type="button"
          onClick={() => {
            setAlunoLogado(null);
            setModo('login');
          }}
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Formulário de cadastro */}
      {modo === 'cadastro' && (
        <>
          <h3>Cadastro</h3>

          <form onSubmit={cadastrar}>
            <label htmlFor="nome">Coloque seu nome completo</label>
            <input
              id="nome"
              className="input-1"
              type="text"
              placeholder="Nome"
              value={formulario.nome}
              onChange={(e) =>
                setFormulario({ ...formulario, nome: e.target.value })
              }
            />

            <label htmlFor="email">Vincule um e-mail</label>
            <input
              id="email"
              className="input-2"
              type="email"
              placeholder="E-mail"
              value={formulario.email}
              onChange={(e) =>
                setFormulario({ ...formulario, email: e.target.value })
              }
            />

            <label htmlFor="senha">Crie uma senha</label>
            <input
              id="senha"
              className="input-3"
              type="password"
              placeholder="Senha"
              value={formulario.senha}
              onChange={(e) =>
                setFormulario({ ...formulario, senha: e.target.value })
              }
            />

            {/* Lembretes para criar uma senha segura */}
            <p>8 caracteres ou mais.</p>
            <p>Maiúsculas, minúsculas, números e símbolos.</p>
            <p>Sem sequências (123456).</p>
            <p>Sem dados pessoais.</p>

            <button className="btn-1" type="submit">
              Cadastrar
            </button>
          </form>
        </>
      )}

      {/* Formulário de login */}
      {modo === 'login' && (
        <>
          <h3>Login</h3>

          <form onSubmit={entrar}>
            <label htmlFor="emailLogin">Digite seu e-mail</label>
            <input
              id="emailLogin"
              className="input-2"
              type="email"
              placeholder="E-mail"
              value={login.email}
              onChange={(e) =>
                setLogin({ ...login, email: e.target.value })
              }
            />

            <label htmlFor="senhaLogin">Digite sua senha</label>
            <input
              id="senhaLogin"
              className="input-3"
              type="password"
              placeholder="Senha"
              value={login.senha}
              onChange={(e) =>
                setLogin({ ...login, senha: e.target.value })
              }
            />

            <button className="btn-2" type="submit">
              Entrar
            </button>
          </form>
        </>
      )}

      {/* Permite trocar entre cadastro e login */}
      <button
        type="button"
        onClick={() =>
          setModo(modo === 'cadastro' ? 'login' : 'cadastro')
        }
      >
        {modo === 'cadastro'
          ? 'Já tem uma conta? Entrar'
          : 'Não tem uma conta? Cadastrar'}
      </button>
    </div>
  );
}

export default Main;