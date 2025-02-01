// Import Firebase
import { db, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "./firebase-config.js";

// Aggiungere gli articoli alla lista Firestore
document.addEventListener("DOMContentLoaded", function() {
    const passwordCorretta = "famiglia123";
    const passwordInserita = prompt("Inserisci la password per accedere al sito:");

    if (passwordInserita !== passwordCorretta) {
        alert("Password errata. Accesso negato.");
        document.body.innerHTML = "<h1>Accesso Negato</h1><p>Non sei autorizzato ad accedere a questo sito.</p>";
        return;
    }

    let nomeUtente = prompt("Inserisci il tuo nome:");
    if (!nomeUtente || nomeUtente.trim() === "") {
        nomeUtente = "Anonimo";
    } else {
        nomeUtente = nomeUtente.trim();
    }

    inizializzaApplicazione(nomeUtente);
});

async function inizializzaApplicazione(nomeUtente) {
    const form = document.getElementById("formArticolo");
    const inputArticolo = document.getElementById("articolo");
    const inputQuantita = document.getElementById("quantita");
    const listaArticoli = document.getElementById("articoli");

    // Carica gli articoli da Firestore
    async function caricaArticoli() {
        const articoli = [];
        const querySnapshot = await getDocs(collection(db, "lista_spesa"));
        querySnapshot.forEach((doc) => {
            articoli.push({ id: doc.id, ...doc.data() });
        });
        return articoli;
    }

    // Funzione per aggiornare la visualizzazione della lista
    async function renderArticoli() {
        listaArticoli.innerHTML = "";
        const articoli = await caricaArticoli();
        articoli.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.nome} - Quantità: ${item.quantita} <br>
                <small>Aggiunto da: ${item.utente}</small>
                <br>
                <button onclick="modificaArticolo('${item.id}')">Modifica</button>
                <button onclick="rimuoviArticolo('${item.id}')">Rimuovi</button>
            `;
            listaArticoli.appendChild(li);
        });
    }

    // Funzione per salvare gli articoli su Firestore
    async function salvaArticoli(nome, quantita, utente) {
        try {
            await addDoc(collection(db, "lista_spesa"), {
                nome: nome,
                quantita: quantita,
                utente: utente
            });
            renderArticoli();  // Ricarica la lista dopo aver salvato
        } catch (e) {
            alert("Errore nel salvataggio dell'articolo.");
        }
    }

    // Gestione dell'evento submit del form
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nuovoNome = inputArticolo.value.trim();
        const nuovaQuantita = parseInt(inputQuantita.value, 10);

        if (nuovoNome === "" || isNaN(nuovaQuantita) || nuovaQuantita < 1) {
            alert("Per favore, inserisci un articolo valido e una quantità maggiore di 0.");
            return;
        }

        // Aggiungi articolo a Firestore
        salvaArticoli(nuovoNome, nuovaQuantita, nomeUtente);
        form.reset();
    });

    // Funzione per rimuovere un articolo da Firestore
    window.rimuoviArticolo = async function(id) {
        try {
            await deleteDoc(doc(db, "lista_spesa", id));
            renderArticoli();  // Ricarica la lista dopo aver rimosso
        } catch (e) {
            alert("Errore nella rimozione dell'articolo.");
        }
    };

    // Funzione per modificare un articolo su Firestore
    window.modificaArticolo = async function(id) {
        const articoloCorrente = await getDocs(doc(db, "lista_spesa", id));
        const nuovoNome = prompt("Modifica il nome dell'articolo:", articoloCorrente.nome);
        if (nuovoNome === null || nuovoNome.trim() === "") {
            alert("Il nome non può essere vuoto. Modifica annullata.");
            return;
        }

        let nuovaQuantita = prompt("Modifica la quantità:", articoloCorrente.quantita);
        nuovaQuantita = parseInt(nuovaQuantita, 10);
        if (isNaN(nuovaQuantita) || nuovaQuantita < 1) {
            alert("Quantità non valida. Modifica annullata.");
            return;
        }

        // Modifica l'articolo
        await updateDoc(doc(db, "lista_spesa", id), {
            nome: nuovoNome.trim(),
            quantita: nuovaQuantita
        });
        renderArticoli();
    };

    // Carica la lista iniziale
    renderArticoli();
}
