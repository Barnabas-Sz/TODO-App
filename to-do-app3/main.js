// Referenzen zu Formularelementen und andere wichtige Elemente erhalten
let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let beschreibung = document.getElementById("beschreibung");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let autor = document.getElementById("autor");
let kategorie = document.getElementById("kategorie");
let wichtig = document.getElementById("wichtig");
let dringend = document.getElementById("dringend");
let range = document.getElementById("range");
let rangeValue = document.getElementById("rangeValue");
let searchInput = document.getElementById("searchInput");

// Aktualisieren der Prozentzahl im slider, wenn sich der Prozentwert ändert
range.addEventListener("input", () => {
  rangeValue.textContent = `${range.value}%`;
});

// Formularübermittlung behandeln und das Formular validieren
form.addEventListener("submit", (e) => {
  e.preventDefault(); 
  formValidation(); 
});

// Aufgaben basierend auf der Sucheingabe filtern
searchInput.addEventListener("input", () => {
  createTasks(); 
});

// Formularfelder validieren
let formValidation = () => {
  let isValid = true; 
  msg.innerHTML = ""; 

  // Jedes Formularfeld validieren und Fehlermeldungen bei Bedarf anzeigen
  if (textInput.value.trim() === "") {
    isValid = false;
    msg.innerHTML += "<p>Task title kann nicht leer sein</p>";
  }

  if (autor.value.trim() === "") {
    isValid = false;
    msg.innerHTML += "<p>Autor kann nicht leer sein</p>";
  }

  if (beschreibung.value.trim() === "") {
    isValid = false;
    msg.innerHTML += "<p>Beschreibung kann nicht leer sein</p>";
  }

  if (startDate.value === "") {
    isValid = false;
    msg.innerHTML += "<p>Start date kann nicht leer sein</p>";
  }

  if (endDate.value === "") {
    isValid = false;
    msg.innerHTML += "<p>End date kann nicht leer sein</p>";
  }

  if (range.value === "") {
    isValid = false;
    msg.innerHTML += "<p>'Wie weit' kann nicht leer sein</p>";
  }

  // Sicherstellen, dass das Startdatum vor dem Enddatum liegt
  if (new Date(startDate.value) > new Date(endDate.value)) {
    isValid = false;
    msg.innerHTML += "<p>End date muss nach dem start date sein</p>";
  }

  // Wenn das Formular gültig ist, Daten hinzufügen
  if (isValid) {
    console.log("success");
    msg.innerHTML = "";
    acceptData(); 
    add.setAttribute("data-bs-dismiss", "modal"); 
    add.click();

    // Attribut für das Schließen des Modals zurücksetzen
    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  } else {
    console.log("failure");
  }
};

let data = []; // Datenarray initialisieren

// Formulardaten verarbeiten und zur Aufgabenliste hinzufügen
let acceptData = () => {
  let taskMessage = "";

  // Aufgabenmeldung basierend auf Priorität (Wichtigkeit und Dringlichkeit) bestimmen
  if (wichtig.checked && dringend.checked) {
    taskMessage = "Sofort erledigen";
  } else if (wichtig.checked && !dringend.checked) {
    taskMessage = "Einplanen und Wohlfühlen";
  } else if (!wichtig.checked && dringend.checked) {
    taskMessage = "Gib es ab";
  } else {
    taskMessage = "Weg damit";
  }

  // Neue Aufgabe zum Datenarray hinzufügen
  data.push({
    text: textInput.value,
    startDate: startDate.value,
    endDate: endDate.value,
    beschreibung: beschreibung.value,
    autor: autor.value,
    kategorie: kategorie.value,
    wichtig: wichtig.checked,
    dringend: dringend.checked,
    range: range.value,
    taskMessage: taskMessage
  });

  // Aufgaben im lokalen Speicher speichern
  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks(); 
};

// Tasks im Taskcontainer anzeigen
let createTasks = () => {
  tasks.innerHTML = ""; // Vorhandene Tasks löschen

  const searchQuery = searchInput.value.toLowerCase(); 

  // Tasks basierend auf der Suchabfrage filtern und anzeigen
  data
    .filter((task) => task.text.toLowerCase().includes(searchQuery) || task.beschreibung.toLowerCase().includes(searchQuery) || task.autor.toLowerCase().includes(searchQuery))
    .map((x, y) => {
      return (tasks.innerHTML += `
    <div id=${y}>
          <span class="fw-bold">${x.text}</span>
          <span class="small text-secondary">${x.range}%</span>
          <span class="small text-secondary">${x.autor}</span>
          <span class="small text-secondary">${x.startDate}</span>
          <span class="small text-secondary">${x.endDate}</span>
          <span class="small text-secondary">${x.kategorie}</span>
          <p>${x.beschreibung}</p>
          <p class="fw-bold">${x.taskMessage}</p>

          <span class="options">
            <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
          </span>
        </div>
    `);
    });

  resetForm(); // Formularfelder nach der Anzeige der Aufgaben zurücksetzen
};

// Task aus der Liste und dem lokalen Speicher löschen
let deleteTask = (e) => {
  e.parentElement.parentElement.remove(); // Task aus dem DOM entfernen
  data.splice(e.parentElement.parentElement.id, 1); // Task aus dem Datenarray entfernen
  localStorage.setItem("data", JSON.stringify(data)); // Lokalen Speicher aktualisieren
  console.log(data);
};

// Task bearbeiten, indem das Formular mit den Task-daten gefüllt wird
let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  // Formularfelder mit den Daten der ausgewählten Task füllen
  textInput.value = selectedTask.children[0].innerHTML;
  range.value = selectedTask.children[1].innerHTML.replace("%", "");
  rangeValue.textContent = selectedTask.children[1].innerHTML;
  autor.value = selectedTask.children[2].innerHTML;
  startDate.value = selectedTask.children[3].innerHTML;
  endDate.value = selectedTask.children[4].innerHTML;
  kategorie.value = selectedTask.children[5].innerHTML;
  beschreibung.value = selectedTask.children[6].innerHTML;

  // Taskmeldung bestimmen und Kontrollkästchen entsprechend setzen
  const taskMessage = selectedTask.children[7].innerHTML;
  wichtig.checked = taskMessage === "Sofort erledigen" || taskMessage === "Einplanen und Wohlfühlen";
  dringend.checked = taskMessage === "Sofort erledigen" || taskMessage === "Gib es ab";

  deleteTask(e); // Vorherige Task vor der Bearbeitung entfernen
};

// Formularfelder zurücksetzen
let resetForm = () => {
  textInput.value = "";
  startDate.value = "";
  endDate.value = "";
  beschreibung.value = "";
  autor.value = "";
  kategorie.value = "";
  wichtig.checked = false;
  dringend.checked = false;
  range.value = "";
  rangeValue.textContent = "0%";
};

// Daten aus dem lokalen Speicher beim Laden der Seite initialisieren
(() => {
  data = JSON.parse(localStorage.getItem("data")) || []
  console.log(data);
  createTasks(); 
})();
