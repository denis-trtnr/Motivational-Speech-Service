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

    const prompt = 'My mood right now is '+ moodSelect + '. Can you write me a short motivational speech in the context of the following three words: '+ inputField +'? The speech should be between 60 and 100 characters long and should not contain smileys or special characters.';

    // Generate the motivational speeches
    const generatedSpeech = await generateSpeech(prompt)
    document.getElementById("generated-text-1").innerText = extractCleanText(generatedSpeech);

    document.getElementById('loading-spinner-generator').style.display = 'none';
}

// Function to format the response text from llm
function extractCleanText(jsonString) {
    let cleanText = jsonString.replace(/[^\w\s.,:!?'-]/g, '');
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    return cleanText;
}

// Function to call the LLM-API at server and generate the speech
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

// Function to call the Database-API at server and save the data
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

// Function to call the TTS-API at server and generate the audio
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

// Event listener for the "Generate Audio" button
document.getElementById('play-audio-btn').addEventListener('click', async function () {
    const generatedText = document.getElementById('generated-text-1').textContent.trim();
    
    if (!generatedText || generatedText.startsWith("---")) {
        alert("Please select or generate a valid text before generating audio.");
        return;
    }

    // Show the loading spinner
    document.getElementById('loading-spinner').style.display = 'block';
    
    // Hide the audio element until audio is ready
    document.getElementById('audioOutput').style.display = 'none';

    try {
        // Call the TTS API to generate the audio
        const audioBlob = await generateAudio(generatedText);
        
        // Create a URL for the audio and set it for the "audio" element to play
        const audioUrl = URL.createObjectURL(audioBlob);

        // Update the audio element with the generated audio and show it
        const audioElement = document.getElementById('audioOutput');
        audioElement.src = audioUrl;
        audioElement.style.display = 'block';  // Show the audio player

        // Data to save
        const data = {
            input: inputField,
            mood: moodSelect,
            speech_proposal: extractCleanText(generatedSpeech),
            audio_file: audioBlob
        };

        await saveData(data)

        // Auto-play the audio after it's generated
        audioElement.play();
        console.log("Audio successfully generated and played.");
    } catch (error) {
        alert("Failed to generate audio. Please try again.");
    } finally {
        // Hide the loading spinner after the process is completed
        document.getElementById('loading-spinner').style.display = 'none';
    }
});
