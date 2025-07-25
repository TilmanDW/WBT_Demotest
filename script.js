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

// Configuration
const CONFIG = {
    // We'll use environment variable or fallback to public endpoint
    API_TOKEN: null, // Will be set from environment
    MODELS: {
        summarize: 'microsoft/DialoGPT-medium',
        reformat: 'microsoft/DialoGPT-medium', 
        adjust: 'microsoft/DialoGPT-medium'
    }
};

// Load example text with animation
function loadExample(exampleNumber) {
    const textArea = document.getElementById('inputText');
    textArea.value = '';
    
    // Simulate typing effect
    const text = examples[exampleNumber];
    let i = 0;
    const typeInterval = setInterval(() => {
        textArea.value += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            showStatus('Example loaded successfully!', 'success');
        }
    }, 10);
}

// Clear all content with confirmation
function clearAll() {
    if (document.getElementById('inputText').value.trim() || document.getElementById('output').textContent.trim()) {
        if (confirm('Are you sure you want to clear all content?')) {
            document.getElementById('inputText').value = '';
            document.getElementById('output').textContent = '';
            showStatus('Content cleared!', 'success');
        }
    }
}

// Show status messages
function showStatus(message, type) {
    // Remove existing status
    const existingStatus = document.querySelector('.status-indicator');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const status = document.createElement('div');
    status.className = `status-indicator status-${type}`;
    status.textContent = message;
    document.body.appendChild(status);
    
    setTimeout(() => {
        if (status.parentNode) {
            status.remove();
        }
    }, 3000);
}

// Process text with different prompts
async function processText(action) {
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        showStatus('Please enter some text first!', 'error');
        return;
    }

    if (inputText.length > 2000) {
        showStatus('Text is too long. Please use shorter text (max 2000 characters).', 'error');
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
    let actionName = '';
    
    switch(action) {
        case 'summarize':
            prompt = `Summarize this text in 2-3 sentences:\n\n${inputText}\n\nSummary:`;
            actionName = 'Summarization';
            break;
        case 'reformat':
            prompt = `Rewrite this text with better structure and formatting:\n\n${inputText}\n\nReformatted:`;
            actionName = 'Reformatting';
            break;
        case 'adjust':
            prompt = `Rewrite this text in a more professional tone:\n\n${inputText}\n\nProfessional version:`;
            actionName = 'Tone adjustment';
            break;
    }

    try {
        const response = await queryHuggingFace(prompt, action);
        if (response && response.trim()) {
            output.textContent = response;
            showStatus(`${actionName} completed successfully!`, 'success');
        } else {
            throw new Error('Empty response from AI model');
        }
    } catch (error) {
        console.error('Error:', error);
        output.textContent = `Sorry, there was an error processing your request: ${error.message}\n\nThis might be due to:\n- Model loading (please try again in a moment)\n- Rate limiting\n- Network issues\n\nPlease try again or use shorter text.`;
        showStatus(`${actionName} failed. Please try again.`, 'error');
    } finally {
        // Hide loading and enable buttons
        loading.classList.add('hidden');
        buttons.forEach(btn => btn.disabled = false);
    }
}

// Updated function to use our API endpoint
async function queryHuggingFace(prompt, action) {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: prompt,
            action: action
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    const result = data.result;
    
    // Handle different response formats
    if (Array.isArray(result) && result[0]) {
        if (result[0].generated_text) {
            return cleanResponse(result[0].generated_text, prompt);
        } else if (result[0].summary_text) {
            return result[0].summary_text;
        }
    } else if (result.generated_text) {
        return cleanResponse(result.generated_text, prompt);
    }
    
    return 'Unable to process the text. Please try again.';
}
// Clean AI response
function cleanResponse(response, originalPrompt) {
    if (!response) return '';
    
    // Remove the original prompt if it's included in the response
    let cleaned = response.replace(originalPrompt, '').trim();
    
    // Remove common AI artifacts
    cleaned = cleaned.replace(/^(Summary:|Reformatted:|Professional version:|Here is|Here's)/i, '').trim();
    
    // Remove extra whitespace and newlines
    cleaned = cleaned.replace(/\n\s*\n/g, '\n').trim();
    
    return cleaned || 'Unable to process the text. Please try again with different content.';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Try to get API token from environment (this will work in Vercel)
    // Note: In client-side JS, we can't access process.env directly
    // The token will be set via Vercel environment variables
    
    console.log('LLM Text Demo initialized');
    showStatus('Welcome! Load an example or enter your own text.', 'success');
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                loadExample(1);
                break;
            case '2':
                e.preventDefault();
                loadExample(2);
                break;
            case 'Enter':
                e.preventDefault();
                processText('summarize');
                break;
        }
    }
});
