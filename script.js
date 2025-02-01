document.addEventListener("DOMContentLoaded", function() {
    // Imposta la password corretta
    const passwordCorretta = "famiglia123";
    const passwordInserita = prompt("Inserisci la password per accedere al sito:");
  
    if (passwordInserita !== passwordCorretta) {
      alert("Password errata. Accesso negato.");
      document.body.innerHTML = "<h1>Accesso Negato</h1><p>Non sei autorizzato ad accedere a questo sito.</p>";
      return;
    }
  
    // Se la password è corretta, chiedi il nome dell'utente
    let nomeUtente = prompt("Inserisci il tuo nome:");
    // Se l'utente non inserisce nulla, assegna un nome predefinito
    if (!nomeUtente || nomeUtente.trim() === "") {
      nomeUtente = "Anonimo";
    } else {
      nomeUtente = nomeUtente.trim();
    }
  
    // Inizializza l'applicazione, passando il nome dell'utente
    inizializzaApplicazione(nomeUtente);
  });
  
  function inizializzaApplicazione(nomeUtente) {
    const form = document.getElementById("formArticolo");
    const inputArticolo = document.getElementById("articolo");
    const inputQuantita = document.getElementById("quantita");
    const listaArticoli = document.getElementById("articoli");
  
    // Carica gli articoli salvati oppure usa un array vuoto
    // Ora ogni articolo sarà un oggetto con: nome, quantita e utente
    let articoli = JSON.parse(localStorage.getItem("articoli")) || [];
  
    // Funzione per aggiornare la visualizzazione della lista
    function renderArticoli() {
      listaArticoli.innerHTML = "";
      articoli.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.nome} - Quantità: ${item.quantita} <br>
          <small>Aggiunto da: ${item.utente}</small>
          <br>
          <button onclick="modificaArticolo(${index})">Modifica</button>
          <button onclick="rimuoviArticolo(${index})">Rimuovi</button>
        `;
        listaArticoli.appendChild(li);
      });
    }
  
    // Funzione per salvare gli articoli in localStorage
    function salvaArticoli() {
      localStorage.setItem("articoli", JSON.stringify(articoli));
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
  
      // Cerca se l'articolo esiste già (case insensitive)
      const indiceEsistente = articoli.findIndex(
        item => item.nome.toLowerCase() === nuovoNome.toLowerCase()
      );
  
      if (indiceEsistente !== -1) {
        // Se esiste, aggiorna la quantità (sommandola)
        //articoli[indiceEsistente].quantita += nuovaQuantita;
        //alert(`L'articolo esiste già. La quantità è stata aggiornata a ${articoli[indiceEsistente].quantita}.`);
        alert(`L'articolo è già presente`);
      } else {
        // Altrimenti, aggiungi un nuovo oggetto articolo includendo anche il nome dell'utente
        articoli.push({ nome: nuovoNome, quantita: nuovaQuantita, utente: nomeUtente });
      }
  
      salvaArticoli();
      renderArticoli();
      form.reset();
    });
  
    // Funzione globale per rimuovere un articolo
    window.rimuoviArticolo = function(index) {
      articoli.splice(index, 1);
      salvaArticoli();
      renderArticoli();
    };
  
    // Funzione globale per modificare un articolo
    window.modificaArticolo = function(index) {
      const articoloCorrente = articoli[index];
  
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
  
      // Aggiorna l'articolo (manteniamo il nome utente originale)
      articoli[index] = { nome: nuovoNome.trim(), quantita: nuovaQuantita, utente: articoloCorrente.utente };
  
      salvaArticoli();
      renderArticoli();
    };
  
    // Render iniziale della lista
    renderArticoli();
  }
  