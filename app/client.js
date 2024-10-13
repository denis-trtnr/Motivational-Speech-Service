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

async function generateText() {

    const inputField = document.getElementById("input-field").value;
    const moodSelect = document.getElementById("mood-select").value;
    const suggestionText = document.getElementById("text-suggestion");

    suggestionText.innerText = `Generierter Text basierend auf: "${inputField}", "${moodSelect}"`;

    // Beispielhafter generierter Text (du kannst hier deine eigene Logik einfügen)
    const generatedSpeech = "Beispielvorschlag basierend auf " + inputField + " und Stimmung " + moodSelect;

    // Generate 3 different prompts with the users input
    const prompt1 = 'My mood right now is '+ moodSelect + '. Based on the childrens books about Connie. Write me a short motivational Connie story using the following keywords: '+ inputField +'. Then, at the end, say that the person can overcome their problem just like Connie. Please answer in english.';
    const prompt2 = 'My mood right now is '+ moodSelect + '. Can you write me a short motivational speech in the context of the following three words: '+ inputField +'? The speech should be between 60 and 100 characters long.';
    const prompt3 = 'My mood right now is '+ moodSelect + '. Can you write me a short motivational rhyme or poem to inspire me? The context of the rhyme/poem should include the following three words: '+ inputField +'.';

    // Generate the motivational speeches
    const generatedSpeech1 = await generateSpeech(prompt3)
    const result = extractCleanText(JSON.stringify(generatedSpeech1))


    // update generierter Text in p-elements
    document.getElementById("generated-text-1").innerText = `${result}`;


    // Die Daten, die an den Server gesendet werden sollen
    const data = {
        input: inputField,
        mood: moodSelect,
        speech_proposal: result
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
}

function extractCleanText(jsonString) {
    // 1. Entferne alle Backslashes, geschweifte Klammern, Anführungszeichen und Zeilenumbrüche
    let cleanText = jsonString.replace(/[\\{}"\n\r]/g, '');

    // 2. Entferne unnötige Leerzeichen, indem du mehrere Leerzeichen durch ein einzelnes ersetzt
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    return cleanText;
}



async function generateSpeech(prompt) {

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response; // Die generierte Rede

    } catch (error) {
        console.error('Error:', error);
    }
}

async function generateAudio(text, speaker = null) {
    const requestBody = {
        text: text,
    };

    try {
        // Send POST request to the backend
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // Get audio data as blob
        const audioBlob = await response.blob();

        // Return the blob to the caller
        return audioBlob;
    } catch (error) {
        console.error("Error generating audio:", error);
        throw error;  // Re-throw the error to be handled by the caller
    }
}

/*
async function saveData(){

     // Die Daten, die an den Server gesendet werden sollen
      const data_db = {
          input: inputField,
          mood: moodSelect,
          speech_proposal: generatedSpeech1
      };

      // Daten an den Server senden
      fetch('/api/speeches', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data_db),
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

}*/

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
   const selectionText = document.getElementById('generated-text-1').innerText;

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

/*
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
*/

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

// Event listener for the "Generate Audio" button
document.getElementById('play-audio-btn').addEventListener('click', async function () {
    const generatedText = document.getElementById('generated-text-1').textContent.trim();
    
    if (!generatedText || generatedText.startsWith("---")) {
        //alert("Please select or generate a valid text before generating audio.");
        //return;
        generatedText = "Hello, welcome to our cool Motivational Speech service!";
    }

    try {
        // Call the TTS API to generate the audio
        const audioBlob = await generateAudio("Hello, welcome to our cool Motivational Speech service!");

        // Create a URL for the audio and set it for the "audio" element to play
        const audioUrl = URL.createObjectURL(audioBlob);

        // Update the "audio" element and play the audio
        const audioElement = new Audio(audioUrl);
        audioElement.play();
        console.log("Audio successfully generated and played.");

        // Update the download button with the generated audio URL
        const downloadButton = document.getElementById('download-audio');
        downloadButton.href = audioUrl;
        downloadButton.download = 'generated_speech.wav';
        downloadButton.style.display = 'inline';  // Show the download button if it was hidden
    } catch (error) {
        alert("Failed to generate audio. Please try again.");
    }
});

/*
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
*/

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
