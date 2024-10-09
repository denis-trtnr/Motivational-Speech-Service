//möglich, dass erst gewisse sachen installiert werden müssen

//import ollama from 'ollama'

// progress = ollama.pull({
//     model: 'llama3.2:1b',
// })

// print(progress)

// const response = await ollama.generate({
//     model: 'llama3.2:1b',
//     prompt: 'Why is the sky blue? Answer in JSON',
//     stream: false,
//     format: 'json',
//     options: {
//         temperature: 0.8
//     } 
// })

// console.log(response.response);

import ollama from 'ollama';

const run = async () => {
    const progress = await ollama.pull({
        model: 'llama3.2:1b',
    });

    console.log(progress);

    const response = await ollama.generate({
        model: 'llama3.2:1b',
        prompt: 'Why is the sky blue? Answer in JSON in 15 words.',
        stream: false,
        format: 'json'/* ,
        options: {
            temperature: 0.8
        } */
    });

    console.log(response.response);
};

run().catch(console.error);

