// Example texts
const examples = {
    1: `I'm sorry, but I don't want to be an emperor. That's not my business. I don't want to rule or conquer anyone. I should like to help everyone - if possible - Jew, Gentile - black man - white. We all want to help one another. Human beings are like that. We want to live by each other's happiness - not by each other's misery. We don't want to hate and despise one another. In this world there is room for everyone. And the good earth is rich and can provide for everyone. The way of life can be free and beautiful, but we have lost the way.

Greed has poisoned men's souls, has barricaded the world with hate, has goose-stepped us into misery and bloodshed. We have developed speed, but we have shut ourselves in. Machinery that gives abundance has left us in want. Our knowledge has made us cynical. Our cleverness, hard and unkind. We think too much and feel too little. More than machinery we need humanity. More than cleverness we need kindness and gentleness. Without these qualities, life will be violent and all will be lost....

The aeroplane and the radio have brought us closer together. The very nature of these inventions cries out for the goodness in men - cries out for universal brotherhood - for the unity of us all. Even now my voice is reaching millions throughout the world - millions of despairing men, women, and little children - victims of a system that makes men torture and imprison innocent people.`,

    2: `Heute möchte ich über eines der größten Erfindungen der Menschheit schreiben: die Tütensuppe. Ja, ihr habt richtig gehört - die Tütensuppe! Diese kleine, unscheinbare Verpackung voller getrockneter Zutaten hat das Leben von Millionen von Menschen revolutioniert.

Denkt nur daran: Früher mussten unsere Vorfahren stundenlang in der Küche stehen, Gemüse schneiden, Fleisch kochen, Gewürze mischen - nur um eine ordentliche Suppe zuzubereiten. Heute? Heute reißen wir eine Tüte auf, gießen heißes Wasser dazu, rühren um, und voilà - eine warme, sättigende Mahlzeit ist fertig!

Die Tütensuppe ist der Inbegriff der modernen Effizienz. Sie ist das Symbol unserer schnelllebigen Zeit, in der jede Sekunde zählt. Studenten schwören darauf, gestresste Büroangestellte leben davon, und selbst Hausfrauen greifen gelegentlich zu diesem praktischen Helfer.

Und die Vielfalt! Hühnersuppe, Tomatensuppe, Pilzsuppe, asiatische Nudelsuppen - für jeden Geschmack ist etwas dabei. Die Industrie hat wahre Kunstwerke der Geschmackskomposition geschaffen, kleine Tütchen voller konzentrierter Genüsse.

Manche mögen die Nase rümpfen und von "künstlich" oder "ungesund" sprechen. Aber ich sage: Die Tütensuppe ist ein Triumph der menschlichen Kreativität und des Fortschritts!`
};

// Load example text
function loadExample(exampleNumber) {
    document.getElementById('inputText').value = examples[exampleNumber];
}

// Clear all content
function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('output').textContent = '';
}

// Process text with different prompts
async function processText(action) {
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
            prompt = `Please provide a concise summary of the following text:\n\n${inputText}\n\nSummary:`;
            break;
        case 'reformat':
            prompt = `Please reformat the following text to make it more readable and well-structured:\n\n${inputText}\n\nReformatted version:`;
            break;
        case 'adjust':
            prompt = `Please rewrite the following text in a more professional and polished tone:\n\n${inputText}\n\nImproved version:`;
            break;
    }

    try {
        const response = await queryHuggingFace(prompt);
        output.textContent = response;
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    } finally {
        // Hide loading and enable buttons
        loading.classList.add('hidden');
        buttons.forEach(btn => btn.disabled = false);
    }
}

// Query Hugging Face API
async function queryHuggingFace(prompt) {
    // Using Hugging Face's free inference API
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                max_length: 500,
                temperature: 0.7,
                do_sample: true
            }
        })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const result = await response.json();
    
    if (result.error) {
        throw new Error(result.error);
    }

    // Handle different response formats
    if (Array.isArray(result) && result[0] && result[0].generated_text) {
        return result[0].generated_text.replace(prompt, '').trim();
    } else if (result.generated_text) {
        return result.generated_text.replace(prompt, '').trim();
    } else {
        return 'Sorry, I could not process your request. The model might be loading. Please try again in a moment.';
    }
}
