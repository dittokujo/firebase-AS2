// src/pages/Principal.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { signOut } from "firebase/auth";

export default function Principal() {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const uid = location.state?.uid || auth.currentUser?.uid;

  useEffect(() => {
    async function buscarDados() {
      if (!uid) {
        navigate("/");
        return;
      }

      try {
        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDadosUsuario(docSnap.data());
        } else {
          console.error("Nenhum dado encontrado no Firestore para este usuário.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, [uid, navigate]);

  async function handleSair() {
    await signOut(auth);
    navigate("/");
  }

  if (carregando) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando dados do usuário...</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Bem-vindo à Página Principal!</h2>
      
      {dadosUsuario ? (
        <div style={{ background: "#f4f4f4", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
          <p><strong>Nome:</strong> {dadosUsuario.nome}</p>
          <p><strong>Sobrenome:</strong> {dadosUsuario.sobrenome}</p>
          <p><strong>Data de Nascimento:</strong> {dadosUsuario.dataNascimento}</p>
          <p><strong>E-mail:</strong> {dadosUsuario.email}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>Não foi possível carregar as informações do usuário.</p>
      )}

      <button onClick={handleSair} style={{ marginTop: "20px", padding: "10px", background: "#d9534f", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
        Sair / Logout
      </button>
    </div>
  );
}