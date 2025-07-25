// Example texts
const examples = {
    1: `I'm sorry, but I don't want to be an emperor. That's not my business. I don't want to rule or conquer anyone. I should like to help everyone - if possible - Jew, Gentile - black man - white. We all want to help one another. Human beings are like that. We want to live by each other's happiness - not by each other's misery. We don't want to hate and despise one another. In this world there is room for everyone. And the good earth is rich and can provide for everyone. The way of life can be free and beautiful, but we have lost the way.

Greed has poisoned men's souls, has barricaded the world with hate, has goose-stepped us into misery and bloodshed. We have developed speed, but we have shut ourselves in. Machinery that gives abundance has left us in want. Our knowledge has made us cynical. Our cleverness, hard and unkind. We think too much and feel too little. More than machinery we need humanity. More than cleverness we need kindness and gentleness. Without these qualities, life will be violent and all will be lost.

The aeroplane and the radio have brought us closer together. The very nature of these inventions cries out for the goodness in men - cries out for universal brotherhood - for the unity of us all. Even now my voice is reaching millions throughout the world - millions of despairing men, women, and little children - victims of a system that makes men torture and imprison innocent people.`,

    2: `Heute möchte ich über eines der größten Erfindungen der Menschheit schreiben: die Tütensuppe. Ja, ihr habt richtig gehört - die Tütensuppe! Diese kleine, unscheinbare Verpackung voller getrockneter Zutaten hat das Leben von Millionen von Menschen revolutioniert.

Denkt nur daran: Früher mussten unsere Vorfahren stundenlang in der Küche stehen, Gemüse schneiden, Fleisch kochen, Gewürze mischen - nur um eine ordentliche Suppe zuzubereiten. Heute? Heute reißen wir eine Tüte auf, gießen heißes Wasser dazu, rühren um, und voilà - eine warme, sättigende Mahlzeit ist fertig!

Die Tütensuppe ist der Inbegriff der modernen Effizienz. Sie ist das Symbol unserer schnelllebigen Zeit, in der jede Sekunde zählt. Studenten schwören darauf, gestresste Büroangestellte leben davon, und selbst Hausfrauen greifen gelegentlich zu diesem praktischen Helfer.

Und die Vielfalt! Hühnersuppe, Tomatensuppe, Pilzsuppe, asiatische Nudelsuppen - für jeden Geschmack ist etwas dabei. Die Industrie hat wahre Kunstwerke der Geschmackskomposition geschaffen, kleine Tütchen voller konzentrierter Genüsse.

Manche mögen die Nase rümpfen und von "künstlich" oder "ungesund" sprechen. Aber ich sage: Die Tütensuppe ist ein Triumph der menschlichen Kreativität und des Fortschritts!`
};

// Load example text
function loadExample(exampleNumber) {
    console.log('Loading example:', exampleNumber);
    const textArea = document.getElementById('inputText');
    if (examples[exampleNumber]) {
        textArea.value = examples[exampleNumber];
        console.log('Example loaded successfully');
    } else {
        console.error('Example not found:', exampleNumber);
    }
}

// Clear all content
function clearAll() {
    console.log('Clearing all content');
    document.getElementById('inputText').value = '';
    document.getElementById('output').textContent = 'Content cleared. Enter some text and try the AI functions above.';
}

// Process text with different prompts
async function processText(action) {
    console.log('Processing text with action:', action);
    
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        alert('Please enter some text first!');
        return;
    }

    const loading = document.getElementById('loading');
    const output = document.getElementById('output');
    const buttons = document.querySelectorAll('.action-btn');
    
    // Show loading and disable buttons
    loading.classList.remove('hidden');
    output.textContent = '';
    buttons.forEach(btn => btn.disabled = true);

    let prompt = '';
    switch(action) {
        case 'summarize':
            prompt = `Please provide a brief summary of the following text:\n\n${inputText}`;
            break;
        case 'reformat':
            prompt = `Please reformat and improve the structure of the following text:\n\n${inputText}`;
            break;
        case 'adjust':
            prompt = `Please rewrite the following text in a more professional tone:\n\n${inputText}`;
            break;
    }

    try {
        // Simulate API call for now - replace with real API later
        await simulateAPICall(prompt, output);
        
    } catch (error) {
        console.error('Error:', error);
        output.textContent = `Error: ${error.message}`;
    } finally {
        // Hide loading and enable buttons
        loading.classList.add('hidden');
        buttons.forEach(btn => btn.disabled = false);
    }
}

// Simulate API call (temporary solution)
async function simulateAPICall(prompt, outputElement) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const inputText = document.getElementById('inputText').value.trim();
    const action = prompt.includes('summary') ? 'summarize' : 
                  prompt.includes('reformat') ? 'reformat' : 'adjust';
    
    let result = '';
    
    switch(action) {
        case 'summarize':
            result = `SUMMARY: This is a simulated summary of your text. The main points include the key themes and ideas presented. Your original text contained ${inputText.split(' ').length} words, and this summary captures the essential message in a more concise format.

[Note: This is a demo response. Connect your Hugging Face API token for real AI processing!]`;
            break;
            
        case 'reformat':
            result = `REFORMATTED VERSION:

Your text has been restructured for better readability:

• Key points have been organized
• Paragraphs have been improved
• Flow and structure enhanced
• Clarity increased

[Note: This is a demo response. Connect your Hugging Face API token for real AI processing!]`;
            break;
            
        case 'adjust':
            result = `PROFESSIONAL VERSION:

Your text has been adjusted to maintain a more professional tone while preserving the original meaning. The language has been refined, formal expressions have been incorporated, and the overall presentation has been enhanced for professional contexts.

[Note: This is a demo response. Connect your Hugging Face API token for real AI processing!]`;
            break;
    }
    
    outputElement.textContent = result;
}

// Test if JavaScript is loaded
console.log('Script loaded successfully!');

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, adding event listeners');
    
    // Test if elements exist
    const inputText = document.getElementById('inputText');
    const output = document.getElementById('output');
    
    if (inputText) {
        console.log('Input text element found');
        inputText.placeholder = "Enter your text here or click one of the example buttons above...";
    } else {
        console.error('Input text element not found');
    }
    
    if (output) {
        console.log('Output element found');
        output.textContent = "Results will appear here after processing...";
    } else {
        console.error('Output element not found');
    }
});
