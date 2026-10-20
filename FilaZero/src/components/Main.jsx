import React from 'react'
import './Main.css'

function Main() {
  return (
    <div>
      {/* Nome Completo */}
      <label htmlFor="nome">Coloque seu nome completo</label>
      <input id="nome" className="input-1" type="text" placeholder="Nome" />

      {/* E-mail */}
      <label htmlFor="email">Vincule um e-mail</label>
      <input id="email" className="input-2" type="email" placeholder="E-mail" />

      {/* Senha */}
      <label htmlFor="senha">Crie uma senha</label>
      <input id="senha" className="input-3" type="password" placeholder="Senha" />

      {/* Requisitos da Senha */}
      <p>8 caracteres ou mais.</p>
      <p>Maiúsculas, minúsculas, números e símbolos.</p>
      <p>Sem sequências (123456).</p>
      <p>Sem dados pessoais.</p>

      <button className="btn-1">Enviar</button>
    </div>
  );
}


export default Main


