function updateSuggestion() {
    const inputField = document.getElementById("input-field");
    const suggestionText = document.getElementById("text-suggestion");
    suggestionText.innerText = inputField.value || '--- Vorschlag ---'; 
}

function generateText() {
    const inputField = document.getElementById("input-field");
    const suggestionText = document.getElementById("text-suggestion");
    suggestionText.innerText = `Generierter Text basierend auf: "${inputField.value}"`;
    
    // update generierter Text in p-elements
    document.getElementById("generated-text-1").innerText = `Vorschlag 1: ${inputField.value}`;
    document.getElementById("generated-text-2").innerText = `Vorschlag 2: ${inputField.value}`;
    document.getElementById("generated-text-3").innerText = `Vorschlag 3: ${inputField.value}`;
}

//Funktion um Auswahl zu treffen
function selectSuggestion(element) {
    const selectedText = element.innerText; 
    const selectionList = document.querySelector('.suggestion-list ul');
    
    // Text in Auswahlliste setzen
    selectionList.innerHTML = `<li>${selectedText}</li>`;
}

// Event Listener für die Vorschläge
document.querySelectorAll('#generated-texts p').forEach(p => {
    p.addEventListener('click', function() {
        selectSuggestion(this);
    });
});

document.getElementById('download-btn').addEventListener('click', function() {
    // Holt Text aus Auswahlbox (z.B. erster Listeneintrag)
    const selectionText = document.querySelector('.suggestion-list ul li').innerText;

    // Erstelle Blob-Objekt mit dem Text
    const blob = new Blob([selectionText], { type: 'text/plain' });

    // Erstelle Download-Link
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'auswahl.txt';  // Dateiname

    // Fügt Link dem Dokument hinzu und simuliert Klick darauf
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Entfernt Link nach Download
    document.body.removeChild(downloadLink);
});


document.getElementById('play-audio-btn').addEventListener('click', function() {
    const selectedTextElement = document.querySelector('.suggestion-list ul li');
    const selectionText = selectedTextElement ? selectedTextElement.innerText : 'Keine Auswahl';

    if ('speechSynthesis' in window) {
        // Instanz von SpeechSynthesisUtterance erstellen
        const utterance = new SpeechSynthesisUtterance(selectionText);

        // Einstellungen für Stimme und Geschwindigkeit
        utterance.rate = 0.9; // Geschwindigkeit
        utterance.pitch = 1; // Tonhöhe
        utterance.volume = 1; // Lautstärke

        // Startet die Sprachausgabe
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Web Speech API wird von diesem Browser nicht unterstützt.');
    }
});

function selectSuggestion(element) {
    const selectedText = element.innerText;
    const selectionList = document.querySelector('.suggestion-list ul');

    // Text in Auswahl-Liste setzen
    selectionList.innerHTML = `<li>${selectedText}</li>`;

    // Dynamische Anpassung Höhe
    const listItem = selectionList.querySelector('li');
    listItem.style.height = 'auto'; // Höhe = automatisch Textlänge
}

// Funktioniert noch nicht
document.getElementById("download-audio").addEventListener("click", function () {
    const audioElement = document.getElementById("audio-element"); // Audio-Element
    if (audioElement) {
        const audioSrc = audioElement.src;

        // Erstellt "a"-Tag dynamisch, um Download-Link zu erzeugen
        const downloadLink = document.createElement("a");
        downloadLink.href = audioSrc;
        downloadLink.download = "audio-file.mp3"; // Name der heruntergeladenen Datei

        // Simuliert Klick, um Download zu starten
        downloadLink.click();
    } else {
        alert("Kein Audio vorhanden zum Herunterladen.");
    }
});
