// Function to observe the input field
function updateSuggestion() {
    const inputField = document.getElementById("input-field");
    const words = inputField.value.trim().split(/\s+/);

    if (words.length > 3) {
        inputField.value = words.slice(0, 3).join(' ');
        alert("You can only enter a maximum of 3 words."); // Feedback
    }

}

// Function for retrieving input data, generating and saving the motivational speech
async function generateText() {

    document.getElementById('loading-spinner-generator').style.display = 'block';

    const inputField = document.getElementById("input-field").value;
    const moodSelect = document.getElementById("mood-select").value;
    const suggestionText = document.getElementById("text-suggestion");

    suggestionText.innerText = `Generated speech based of: "${inputField}", "${moodSelect}"`;

    //const prompt1 = 'My mood right now is '+ moodSelect + '. Based on the childrens books about Connie. Write me a short motivational Connie story using the following keywords: '+ inputField +'. Then, at the end, say that the person can overcome their problem just like Connie. Please answer in english.';
    const prompt2 = 'My mood right now is '+ moodSelect + '. Can you write me a short motivational speech in the context of the following three words: '+ inputField +'? The speech should be between 60 and 100 characters long and should not contain smileys or special characters.';
    // const prompt3 = 'My mood right now is '+ moodSelect + '. Can you write me a short motivational rhyme or poem to inspire me? The context of the rhyme/poem should include the following three words: '+ inputField +'.';

    // Generate the motivational speeches
    const generatedSpeech = await generateSpeech(prompt2)

    document.getElementById("generated-text-1").innerText = extractCleanText(generatedSpeech);

    // Data to save
    const data = {
        input: inputField,
        mood: moodSelect,
        speech_proposal: extractCleanText(generatedSpeech)
    };

    await saveData(data)

    document.getElementById('loading-spinner-generator').style.display = 'none';

}

// Function to format the response text from llm
function extractCleanText(jsonString) {
    let cleanText = jsonString.replace(/[^\w\s.,:!?'-]/g, '');
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    return cleanText;
}


// Function to call the API at server and generate the speech
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
        return data.response;

    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to call the API at server and save the data
async function saveData(data_db){

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
            throw new Error('Error while saving the data');
        })
        .then(result => {
            console.log(result);
            alert('The speech has been successfully saved!');
        })
        .catch(error => {
            console.error('Error: ', error);
            alert('Error when saving the speech.');
        });
}

// Function to call the API at server and generate the audio
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


// Function for user selection
function selectSuggestion(element) {
    const selectedText = element.innerText; 
    const selectionList = document.querySelector('.suggestion-list ul');

    selectionList.innerHTML = `<li>${selectedText}</li>`;
}

// Event Listener for the motivational speech
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
        alert("Please select or generate a valid text before generating audio.");
        return;
    }

    // Show the loading spinner
    document.getElementById('loading-spinner').style.display = 'block';
    
    // Hide the audio element and the download button until audio is ready
    document.getElementById('audioOutput').style.display = 'none';
    document.getElementById('download-audio').style.display = 'none';

    //TODO: Replace static strings
    try {
        // Call the TTS API to generate the audio

        const audioBlob = await generateAudio(generatedText);
        
        // Create a URL for the audio and set it for the "audio" element to play
        const audioUrl = URL.createObjectURL(audioBlob);

        // Update the audio element with the generated audio and show it
        const audioElement = document.getElementById('audioOutput');
        audioElement.src = audioUrl;
        audioElement.style.display = 'block';  // Show the audio player

        // Auto-play the audio after it's generated
        audioElement.play();
        console.log("Audio successfully generated and played.");

        // Update the download button with the generated audio URL
        const downloadButton = document.getElementById('download-audio');
        downloadButton.href = audioUrl;
        downloadButton.download = 'generated_speech.wav';
        downloadButton.style.display = 'inline';
    } catch (error) {
        alert("Failed to generate audio. Please try again.");
    } finally {
        // Hide the loading spinner after the process is completed
        document.getElementById('loading-spinner').style.display = 'none';
    }
});