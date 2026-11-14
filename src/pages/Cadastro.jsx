// src/pages/Cadastro.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleCadastro(e) {
    e.preventDefault();
    setErro("");

    try {
      // 1. Cria usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2. Grava os dados adicionais no Firestore usando o UID como ID do documento
      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        sobrenome,
        dataNascimento,
        email,
        uid: user.uid
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/"); // Redireciona para o Login
    } catch (error) {
      console.error(error);
      setErro("Erro ao cadastrar: " + error.message);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Página de Cadastro</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleCadastro} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Sobrenome:</label>
        <input type="text" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required />

        <label>Data de Nascimento:</label>
        <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />

        <label>E-mail:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <button type="submit" style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }}>
          Cadastrar
        </button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Já tem uma conta? <Link to="/">Faça login</Link>
      </p>
    </div>
  );
}