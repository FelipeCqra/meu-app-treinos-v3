// Importamos a conexão e os métodos necessários do nosso arquivo de configuração
import { 
    db, 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy, 
    getDocs 
} from "./firebase-config.js";

// Nome da coleção que você já utilizava no Firestore
const COLLECTION_NAME = "treinos";

/**
 * Salva uma nova sessão de treino no Firestore
 * @param {Object} sessaoCompleta Dados estruturados do treino
 */
export async function salvarTreino(sessaoCompleta) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), sessaoCompleta);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao salvar treino no Firestore: ", error);
        throw error;
    }
}

/**
 * Atualiza um treino existente (Modo Edição)
 * @param {string} docId ID do documento no Firebase
 * @param {Object} dadosAtualizados Novos dados do treino
 */
export async function atualizarTreino(docId, dadosAtualizados) {
    try {
        const docRef = doc(db, COLLECTION_NAME, docId);
        await updateDoc(docRef, dadosAtualizados);
    } catch (error) {
        console.error("Erro ao atualizar treino: ", error);
        throw error;
    }
}

/**
 * Exclui permanentemente um treino do banco de dados
 * @param {string} docId ID do documento a ser deletado
 */
export async function deletarTreinoDoBanco(docId) {
    try {
        const docRef = doc(db, COLLECTION_NAME, docId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Erro ao deletar treino: ", error);
        throw error;
    }
}

/**
 * Busca todos os treinos ordenados por data para gerar o histórico
 * @param {function} callback Função que será executada ao receber os dados
 */
export async function buscarTodosOsTreinos(callback) {
    try {
        // Criamos uma consulta ordenada pelo timestamp de milisegundos (antigo renderLogsEmTempo Real)
        const q = query(collection(db, COLLECTION_NAME), orderBy("dataMilisegundos", "asc"));
        const querySnapshot = await getDocs(q);
        
        let listaTreinos = [];
        querySnapshot.forEach((doc) => {
            let dados = doc.data();
            dados.id = doc.id; // Anexa o ID do documento igual ao seu código antigo
            listaTreinos.push(dados);
        });

        // Envia a lista tratada para quem pediu (geralmente o render.js)
        callback(listaTreinos);
    } catch (error) {
        console.error("Erro ao buscar treinos: ", error);
    }
}