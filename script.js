document.addEventListener('DOMContentLoaded', () => {
    // Example texts
    const exampleText1 = `I'm sorry, but I don't want to be an emperor. That's not my business. I don't want to rule or conquer anyone. I should like to help everyone - if possible - Jew, Gentile - black man - white. We all want to help one another. Human beings are like that. We want to live by each other's happiness - not by each other's misery. We don't want to hate and despise one another. In this world there is room for everyone. And the good earth is rich and can provide for everyone. The way of life can be free and beautiful, but we have lost the way.

Greed has poisoned men's souls, has barricaded the world with hate, has goose-stepped us into misery and bloodshed. We have developed speed, but we have shut ourselves in. Machinery that gives abundance has left us in want. Our knowledge has made us cynical. Our cleverness, hard and unkind. We think too much and feel too little. More than machinery we need humanity. More than cleverness we need kindness and gentleness. Without these qualities, life will be violent and all will be lost....`;

    const exampleText2 = `Ode an die Tütensuppe

Oh Tütensuppe, wie bist Du schön. Verheißung eines warmen Abendessens, schwimmst Du im heißen Wasser in Deinem transparenten Kleid. Ich hab mich in Dich verliebt, als ich ein kleiner Junge war. Du hast mich durch meine Studienzeit begleitet. Jeden Monat, wenn das Geld alle war, warst Du da.

Tütensuppe, verführerisches 30-Cent Abendessen, trotz Inflation bist Du mir treu geblieben.`;

    // DOM Elements
    const userTextArea = document.getElementById('userText');
    const example1Btn = document.getElementById('example1Btn');
    const example2Btn = document.getElementById('example2Btn');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const reformatBtn = document.getElementById('reformatBtn');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const creativeBtn = document.getElementById('creativeBtn');
    const outputText = document.getElementById('outputText');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Load example texts
    example1Btn.addEventListener('click', () => {
        userTextArea.value = exampleText1;
    });

    example2Btn.addEventListener('click', () => {
        userTextArea.value = exampleText2;
    });

    // Show/hide loading indicator
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    // Function to call the Hugging Face Inference API directly (client-side)
    async function processWithHuggingFace(text, instruction) {
        try {
            // Prepare the prompt based on the instruction
            let prompt, model;
            
            if (instruction.includes("summarize")) {
                model = "facebook/bart-large-cnn";
                prompt = text;
            } else {
                model = "google/flan-t5-base";
                prompt = `${instruction}: ${text}`;
            }
            
            const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputs: prompt,
                    options: { wait_for_model: true }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const result = await response.json();
            
            // Different models return different response formats
            if (model === "facebook/bart-large-cnn") {
                return result[0].summary_text;
            } else {
                return result[0].generated_text;
            }
        } catch (error) {
            console.error("Error processing with Hugging Face:", error);
            return useLocalProcessing(text, instruction);
        }
    }
    
    // Fallback to local processing if API fails
    function useLocalProcessing(text, instruction) {
        console.log("Falling back to local processing");
        
        if (instruction.includes("summarize")) {
            return summarizeLocally(text);
        } else if (instruction.includes("bullet")) {
            return bulletPointsLocally(text);
        } else if (instruction.includes("simplify")) {
            return simplifyLocally(text);
        } else {
            return creativeLocally(text);
        }
    }
    
    // Local processing functions
    function summarizeLocally(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return "Summary (processed locally):\n\n" + 
            sentences.slice(0, 3).join(". ") + ".";
    }
    
    function bulletPointsLocally(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        return "Bullet Points (processed locally):\n\n" +
            sentences.slice(0, 5).map(s => "• " + s.trim()).join("\n");
    }
    
    function simplifyLocally(text) {
        return "Simplified Version (processed locally):\n\n" +
            text.split(/[.!?]+/).slice(0, 3).join(". ") + ".";
    }
    
    function creativeLocally(text) {
        return "Creative Version (processed locally):\n\n✨ " +
            text.split(/[.!?]+/).slice(0, 3).join("! ") + "! ✨";
    }

    // Button click handlers
    summarizeBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        showLoading();
        try {
            const result = await processWithHuggingFace(
                text, 
                "Summarize the following text in a concise way"
            );
            outputText.innerHTML = result;
        } catch (error) {
            outputText.innerHTML = `Error: ${error.message}`;
        } finally {
            hideLoading();
        }
    });

    reformatBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        showLoading();
        try {
            const result = await processWithHuggingFace(
                text, 
                "Reformat the following text as a list of bullet points"
            );
            outputText.innerHTML = result;
        } catch (error) {
            outputText.innerHTML = `Error: ${error.message}`;
        } finally {
            hideLoading();
        }
    });

    simplifyBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        showLoading();
        try {
            const result = await processWithHuggingFace(
                text, 
                "Simplify the following text to be easier to understand"
            );
            outputText.innerHTML = result;
        } catch (error) {
            outputText.innerHTML = `Error: ${error.message}`;
        } finally {
            hideLoading();
        }
    });

    creativeBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        showLoading();
        try {
            const result = await processWithHuggingFace(
                text, 
                "Transform the following text into a creative, engaging version"
            );
            outputText.innerHTML = result;
        } catch (error) {
            outputText.innerHTML = `Error: ${error.message}`;
        } finally {
            hideLoading();
        }
    });
});
