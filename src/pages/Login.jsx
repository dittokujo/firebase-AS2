// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMensagemErro("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      navigate("/principal", { state: { uid: userCredential.user.uid } });
    } catch (error) {
      console.error(error);
      setMensagemErro("Usuário não está cadastrado ou senha incorreta.");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Página de Login</h2>
      {mensagemErro && <p style={{ color: "red", fontWeight: "bold" }}>{mensagemErro}</p>}
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>E-mail:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <button type="submit" style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }}>
          Acessar Página Principal
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}