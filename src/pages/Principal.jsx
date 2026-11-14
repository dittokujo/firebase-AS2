// src/pages/Principal.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Principal() {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Monitora o estado de autenticação do Firebase em tempo real
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Se não houver usuário logado, manda de volta para o login
        navigate("/");
        return;
      }

      try {
        // Busca os dados no Firestore usando o UID real do usuário autenticado
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDadosUsuario(docSnap.data());
        } else {
          console.error("Nenhum dado encontrado no Firestore para este UID.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  async function handleSair() {
    await signOut(auth);
    navigate("/");
  }

  if (carregando) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "white", fontFamily: "sans-serif" }}>Carregando dados do usuário...</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "sans-serif", color: "white" }}>
      <h2>Bem-vindo à Página Principal!</h2>
      
      {dadosUsuario ? (
        <div style={{ background: "#222", padding: "20px", borderRadius: "8px", marginTop: "20px", border: "1px solid #444" }}>
          <p><strong>Nome:</strong> {dadosUsuario.nome}</p>
          <p><strong>Sobrenome:</strong> {dadosUsuario.sobrenome}</p>
          <p><strong>Data de Nascimento:</strong> {dadosUsuario.dataNascimento}</p>
          <p><strong>E-mail:</strong> {dadosUsuario.email}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>Não foi possível carregar as informações do usuário do Firestore.</p>
      )}

      <button onClick={handleSair} style={{ marginTop: "20px", padding: "10px 20px", background: "#d9534f", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}>
        Sair / Logout
      </button>
    </div>
  );
}