function updateSuggestion() {
    const inputField = document.getElementById("input-field");
    const suggestionText = document.getElementById("text-suggestion");
    const words = inputField.value.trim().split(/\s+/);

    if (words.length > 3) {
        inputField.value = words.slice(0, 3).join(' ');
        alert("Sie können nur maximal 3 Wörter eingeben."); // Feedback
    }

    suggestionText.innerText = inputField.value || '--- Vorschlag ---'; 
}

function generateText() {
    // Benutzereingaben holen
    const inputField = document.getElementById("input-field").value;
    const moodSelect = document.getElementById("mood-select").value;
    const suggestionText = document.getElementById("text-suggestion");
    suggestionText.innerText = `Generierter Text basierend auf: "${inputField}", "${moodSelect}"`;

    // Beispielhafter generierter Text (du kannst hier deine eigene Logik einfügen)
    const generatedSpeech = "Beispielvorschlag basierend auf " + inputField + " und Stimmung " + moodSelect;

    // Die Daten, die an den Server gesendet werden sollen
    const data = {
        input: inputField,
        mood: moodSelect,
        speech_proposal: generatedSpeech
    };

    // Daten an den Server senden
    fetch('/api/speeches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Fehler beim Speichern der Daten');
    })
    .then(result => {
        console.log(result);
        // Erfolgreiches Speichern
        alert('Die Rede wurde erfolgreich gespeichert!');
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Fehler beim Speichern der Rede.');
    });


//----------------------------------------

    // update generierter Text in p-elements
    document.getElementById("generated-text-1").innerText = `Vorschlag 1: ${inputField}`;
    //document.getElementById("generated-text-2").innerText = `Vorschlag 2: ${inputField.value}`;
    //document.getElementById("generated-text-3").innerText = `Vorschlag 3: ${inputField.value}`;
    
    // Vorbereitung der Daten für den POST-Request
    const requestData = {
        prompt: inputField,
        mood: moodSelect
    };

    // Senden der Daten an die /generate-Route auf dem Server
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Antwortdaten im DOM aktualisieren
        document.getElementById("generated-text-1").innerText = `Vorschlag 1: ${inputField}`;
        //document.getElementById("generated-text-2").innerText = `Vorschlag 2: ${inputField.value}`;
        //document.getElementById("generated-text-1").innerText = `Vorschlag 1: ${data.message}`;
        document.getElementById("generated-text-2").innerText = `Vorschlag 2: ${data.message}`;
        document.getElementById("generated-text-3").innerText = `Vorschlag 3: ${data.message}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
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



//----------------------------------------------------------------------------------------------------------------------------------

/* Nutzen der Ollama Funktionen - möglich, dass erst gewisse sachen installiert werden müssen

import ollama from 'ollama'

// Pull funktion braucht man glaube ich garnicht - funktioniert auch ohne
// progress = ollama.pull({
//     model: 'llama3.2:1b',
// })

print(progress)

const response = await ollama.generate({
    model: 'llama3.2:1b',
    prompt: 'Why is the sky blue? Answer in JSON',
    stream: false,
    format: 'json',
    options: {
        temperature: 0.8
    } 
})

console.log(response.response); */

//----------------------------------------------------------------------

// Nutzen der Ollama Funktionen - aber als async Funktion - bin mir nicht sicher, was besser funktioniert.

/* import ollama from 'ollama';

const run = async () => {
    const progress = await ollama.pull({
        model: 'llama3.2:1b',
    });

    console.log(progress);

    const response = await ollama.generate({
        model: 'llama3.2:1b',
        prompt: 'Why is the sky blue? Answer in JSON in 15 words.',
        stream: false,
        format: 'json' //,
        // options: {
        //     temperature: 0.8
        // }
    })

    console.log(response.response)
}

run().catch(console.error) */

//----------------------------------------------------------------------


//muss noch als funktion verpackt werden ggf in generatetext ergänzen
// ganz normale REST Abfragen

//localhost muss hier dann noch gegen die ClusterIP ausgetauscht werden - die kann erst ausgelesen werden, wenn das Helm Chart ausgerollt wurde
const url = 'http://localhost:11434/api/generate';

const headers = {
    'Content-Type': 'application/json'
};

const data = {
    model: 'llama3.2:1b',
    prompt: 'Why is the sky blue?',
    stream: false,
    format: 'json',
};

fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    const actualResponse = data.response;
    console.log(actualResponse);
})
.catch(error => {
    console.error('Fetch error:', error);
});


//man kann wahrscheinlich um den code zu vershcönern html script hier auslagern
 /* methode um die letezn Einträge zu laden und anzuzeigen
async function loadHistory() {
    const response = await fetch('/history');
    const data = await response.json();

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Liste leeren

    data.history.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry}`;
        historyList.appendChild(li);
    });
}

// Historie beim Laden der Seite abfragen
window.onload = function() {
    loadHistory();
};
*/
