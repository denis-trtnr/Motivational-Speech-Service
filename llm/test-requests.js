// Nutzen der Ollama Funktionen
/* 
//möglich, dass erst gewisse sachen installiert werden müssen

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
    options: {
        temperature: 0.8 //der Wert muss noch ausgetauscht werden durch die Nutzereingabe (WErte zwiscshen 0 und 1)
    }
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


