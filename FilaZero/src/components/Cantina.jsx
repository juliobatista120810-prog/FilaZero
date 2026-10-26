import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './Main.css';

// Lê a lista de alunos salva no navegador (a mesma do cadastro)
function carregarAlunos() {
  try {
    return JSON.parse(localStorage.getItem('alunos')) || [];
  } catch {
    return [];
  }
}

// Lê o histórico de lanches entregues (guardado no aparelho da cantina)
function carregarLanches() {
  try {
    return JSON.parse(localStorage.getItem('lanches')) || [];
  } catch {
    return [];
  }
}

// Salva o histórico de lanches entregues
function salvarLanches(lista) {
  localStorage.setItem('lanches', JSON.stringify(lista));
}

// Devolve a data de hoje no formato AAAA-MM-DD (para limitar 1 lanche por dia)
function hoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Funcionários liberados para entrar (cadastrados antecipadamente)
const FUNCIONARIOS = [
  { usuario: 'samuel22', nome: 'Samuel' },
  { usuario: 'julio56', nome: 'Julio' },
  { usuario: 'vinicius17', nome: 'Vinicius' }
];

// Senha geral de todos os funcionários (por enquanto)
const SENHA_GERAL = '123456';

function Funcionario() {
  // Funcionário que está logado agora (null = ninguém)
  const [funcionarioLogado, setFuncionarioLogado] = useState(null);

  // Guarda o que está sendo digitado no login do funcionário
  const [loginFunc, setLoginFunc] = useState({ usuario: '', senha: '' });

  // Código digitado pelo funcionário (plano B, se a câmera não funcionar)
  const [codigo, setCodigo] = useState('');

  // Aluno encontrado (null = nenhum)
  const [alunoEncontrado, setAlunoEncontrado] = useState(null);

  // Mensagem de resultado (erro ou sucesso)
  const [mensagem, setMensagem] = useState('');

  // Controla se a câmera está ligada
  const [lendo, setLendo] = useState(false);

  // Histórico de lanches entregues
  const [lanches, setLanches] = useState(carregarLanches);

  // Liga a câmera quando "lendo" fica verdadeiro e desliga quando sai da tela
  useEffect(() => {
    if (!lendo) return;

    const leitor = new Html5Qrcode('leitor-qr');

    leitor
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 220 },
        (texto) => {
          setLendo(false);
          aoLerQR(texto);
        },
        () => {}
      )
      .catch(() => {
        setMensagem('Não foi possível abrir a câmera. Use o número da carteirinha.');
        setLendo(false);
      });

    return () => {
      try {
        leitor.stop().catch(() => {});
      } catch {
        // câmera já estava desligada
      }
    };
  }, [lendo]);

  // Depois de ler o QR Code, procura o aluno pelo id que estava dentro dele
  function aoLerQR(texto) {
    try {
      const dados = JSON.parse(texto);
      const aluno = carregarAlunos().find((a) => a.id === dados.id);

      if (aluno) {
        setAlunoEncontrado(aluno);
        setMensagem('');
      } else {
        setMensagem('Carteirinha não encontrada neste aparelho!');
      }
    } catch {
      setMensagem('QR Code inválido!');
    }
  }

  // Procura o aluno pelo Nº da carteirinha (8 primeiros caracteres do id)
  function buscar(e) {
    e.preventDefault();
    setMensagem('');
    setAlunoEncontrado(null);

    const codigoLimpo = codigo.trim().toLowerCase();

    if (!codigoLimpo) {
      setMensagem('Digite o número da carteirinha!');
      return;
    }

    const aluno = carregarAlunos().find(
      (a) => a.id.slice(0, 8).toLowerCase() === codigoLimpo
    );

    if (!aluno) {
      setMensagem('Carteirinha não encontrada!');
      return;
    }

    setAlunoEncontrado(aluno);
  }

  // Registra a entrega do lanche
  function entregarLanche() {
    // Confere se o aluno já pegou o lanche hoje
    const jaPegou = lanches.some(
      (l) => l.alunoId === alunoEncontrado.id && l.data === hoje()
    );

    if (jaPegou) {
      setMensagem('Este aluno já retirou o lanche hoje!');
      setAlunoEncontrado(null);
      return;
    }

    const novoRegistro = {
      alunoId: alunoEncontrado.id,
      nome: alunoEncontrado.nome,
      data: hoje(),
      hora: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const novaLista = [...lanches, novoRegistro];
    setLanches(novaLista);
    salvarLanches(novaLista);

    setMensagem('Lanche entregue com sucesso!');
    setAlunoEncontrado(null);
    setCodigo('');
  }

  // Só mostra os lanches de hoje
  const lanchesDeHoje = lanches.filter((l) => l.data === hoje());

  // Confere o usuário e a senha do funcionário
  function entrarFuncionario(e) {
    e.preventDefault();

    const encontrado = FUNCIONARIOS.find(
      (f) => f.usuario === loginFunc.usuario.trim().toLowerCase()
    );

    if (encontrado && loginFunc.senha === SENHA_GERAL) {
      setFuncionarioLogado(encontrado);
      setLoginFunc({ usuario: '', senha: '' });
      setMensagem('');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  }

  // Tela de login: só aparece enquanto ninguém entrou
  if (!funcionarioLogado) {
    return (
      <div className="funcionario">
        <h2>SENAI Fila Zero</h2>
        <h3>Login do Funcionário</h3>

        <form onSubmit={entrarFuncionario}>
          <label htmlFor="usuarioFunc">Usuário</label>
          <input
            id="usuarioFunc"
            className="input-2"
            type="text"
            placeholder="Usuário"
            value={loginFunc.usuario}
            onChange={(e) =>
              setLoginFunc({ ...loginFunc, usuario: e.target.value })
            }
          />

          <label htmlFor="senhaFunc">Senha</label>
          <input
            id="senhaFunc"
            className="input-3"
            type="password"
            placeholder="Senha"
            value={loginFunc.senha}
            onChange={(e) =>
              setLoginFunc({ ...loginFunc, senha: e.target.value })
            }
          />

          <button className="btn-2" type="submit">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="funcionario">
      <h2>SENAI Fila Zero</h2>
      <h3>Painel do Funcionário</h3>
      <p>Olá, {funcionarioLogado.nome}!</p>

      <button
        type="button"
        onClick={() => {
          setFuncionarioLogado(null);
          setAlunoEncontrado(null);
          setMensagem('');
          setLendo(false);
        }}
      >
        Sair
      </button>


      {/* Leitor de QR Code pela câmera */}
      {lendo ? (
        <>
          <div id="leitor-qr" style={{ width: 300 }}></div>
          <button type="button" onClick={() => setLendo(false)}>
            Cancelar
          </button>
        </>
      ) : (
        <button
          className="btn-1"
          type="button"
          onClick={() => {
            setMensagem('');
            setAlunoEncontrado(null);
            setLendo(true);
          }}
        >
          Ler QR Code com a câmera
        </button>
      )}

      {/* Plano B: digitar o número da carteirinha */}
      <form onSubmit={buscar}>
        <label htmlFor="codigo">Ou digite o Nº da carteirinha</label>
        <input
          id="codigo"
          className="input-1"
          type="text"
          placeholder="Ex: A1B2C3D4"
          maxLength={8}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <button className="btn-1" type="submit">
          Buscar
        </button>
      </form>

      {/* Mensagem de erro ou sucesso */}
      {mensagem && <p>{mensagem}</p>}

      {/* Dados do aluno encontrado */}
      {alunoEncontrado && (
        <div className="aluno-encontrado">
          <p>
            <strong>Nome:</strong> {alunoEncontrado.nome}
          </p>
          <p>
            <strong>E-mail:</strong> {alunoEncontrado.email}
          </p>

          <button className="btn-2" type="button" onClick={entregarLanche}>
            Entregar lanche
          </button>
        </div>
      )}

      {/* Lista dos lanches entregues hoje */}
      <h3>Lanches entregues hoje ({lanchesDeHoje.length})</h3>

      {lanchesDeHoje.length === 0 ? (
        <p>Nenhum lanche entregue ainda.</p>
      ) : (
        <ul>
          {lanchesDeHoje.map((l, i) => (
            <li key={i}>
              {l.hora} - {l.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Funcionario;
