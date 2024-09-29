function updateSuggestion() {
    const inputField = document.getElementById("input-field");
    const suggestionText = document.getElementById("text-suggestion");
    suggestionText.innerText = inputField.value || '--- Vorschlag ---'; 
}

function generateText() {
    const inputField = document.getElementById("input-field");
    const suggestionText = document.getElementById("text-suggestion");
    suggestionText.innerText = `Generierter Text basierend auf: "${inputField.value}"`;
    
    // update generated Text in p-elements
    document.getElementById("generated-text-1").innerText = `Vorschlag 1: ${inputField.value}`;
    document.getElementById("generated-text-2").innerText = `Vorschlag 2: ${inputField.value}`;
    document.getElementById("generated-text-3").innerText = `Vorschlag 3: ${inputField.value}`;
}

//function to choose selection
function selectSuggestion(element) {
    const selectedText = element.innerText; 
    const selectionList = document.querySelector('.suggestion-list ul');
    
    // set text in selection list
    selectionList.innerHTML = `<li>${selectedText}</li>`;
}

// Event Listener for suggestions
document.querySelectorAll('#generated-texts p').forEach(p => {
    p.addEventListener('click', function() {
        selectSuggestion(this);
    });
});
