document.addEventListener('DOMContentLoaded', () => {
    // Example texts
    const exampleText1 = `I'm sorry, but I don't want to be an emperor. That's not my business. I don't want to rule or conquer anyone. I should like to help everyone - if possible - Jew, Gentile - black man - white. We all want to help one another. Human beings are like that. We want to live by each other's happiness - not by each other's misery. We don't want to hate and despise one another. In this world there is room for everyone. And the good earth is rich and can provide for everyone. The way of life can be free and beautiful, but we have lost the way.

Greed has poisoned men's souls, has barricaded the world with hate, has goose-stepped us into misery and bloodshed. We have developed speed, but we have shut ourselves in. Machinery that gives abundance has left us in want. Our knowledge has made us cynical. Our cleverness, hard and unkind. We think too much and feel too little. More than machinery we need humanity. More than cleverness we need kindness and gentleness. Without these qualities, life will be violent and all will be lost....

The aeroplane and the radio have brought us closer together. The very nature of these inventions cries out for the goodness in men - cries out for universal brotherhood - for the unity of us all. Even now my voice is reaching millions throughout the world - millions of despairing men, women, and little children - victims of a system that makes men torture and imprison innocent people.

To those who can hear me, I say - do not despair. The misery that is now upon us is but the passing of greed - the bitterness of men who fear the way of human progress. The hate of men will pass, and dictators die, and the power they took from the people will return to the people. And so long as men die, liberty will never perish. .....

Soldiers! don't give yourselves to brutes - men who despise you - enslave you - who regiment your lives - tell you what to do - what to think and what to feel! Who drill you - diet you - treat you like cattle, use you as cannon fodder. Don't give yourselves to these unnatural men - machine men with machine minds and machine hearts! You are not machines! You are not cattle! You are men! You have the love of humanity in your hearts! You don't hate! Only the unloved hate - the unloved and the unnatural! Soldiers! Don't fight for slavery! Fight for liberty!

In the 17th Chapter of St Luke it is written: "the Kingdom of God is within man" - not one man nor a group of men, but in all men! In you! You, the people have the power - the power to create machines. The power to create happiness! You, the people, have the power to make this life free and beautiful, to make this life a wonderful adventure.

Then - in the name of democracy - let us use that power - let us all unite. Let us fight for a new world - a decent world that will give men a chance to work - that will give youth a future and old age a security. By the promise of these things, brutes have risen to power. But they lie! They do not fulfil that promise. They never will!

Dictators free themselves but they enslave the people! Now let us fight to fulfil that promise! Let us fight to free the world - to do away with national barriers - to do away with greed, with hate and intolerance. Let us fight for a world of reason, a world where science and progress will lead to all men's happiness. Soldiers! in the name of democracy, let us all unite!`;

    const exampleText2 = `Ode an die Tütensuppe

Oh Tütensuppe, wie bist Du schön. Verheißung eines warmen Abendessens, schwimmst Du im heißen Wasser in Deinem transparenten Kleid. Ich hab mich in Dich verliebt, als ich ein kleiner Junge war. Du hast mich durch meine Studienzeit begleitet. Jeden Monat, wenn das Geld alle war, warst Du da.

Tütensuppe, verführerisches 30-Cent Abendessen, trotz Inflation bist Du mir treu geblieben.

Fertiggericht, Sofortnudeln oder Instantsuppe: Deine Namen sind so vielfältig wie Deine Geschmäcker.

Morgens um 4 nach einer langen Nacht des Lernens und der Verzweiflung, bist Du da. Du baust mich auf, schmeckst so gut. Nicht zu viel, nicht zu wenig. Hähnchen oder Gemüse, egal was drauf steht, es wird heiß und gut.

Oh wie ich es liebe, Dich aufzureißen, Dein Pulver mit dem heißen Wasser zu vermischen und die Nudeln zu beobachten, wie sie im Wasser aufgehen. Zubereitung ohne Aufwand, sättigend und zufriedend. Für mich bist Du einzigartig.

Sogar in Japan hab ich Dich gefunden, meine Tütensuppe. Auch dort warst Du meine erste Wahl, wenn der Bauch knurrte und der Geldbeutel leer war. Ob als Ramen-Version im "Cup", oder klassisch mit Plastik verschweißt. Du bleibst in meinem Herzen. Egal wie alt ich werde, Du bist immer da.

Und wenn der Tag der Apokalypse kommt, wenn die Bomben fallen, wenn der Weltuntergang bevorsteht, werde ich einen Vorrat von Dir im Keller haben, Tütensuppe!`;

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

    // Function to call Hugging Face Inference API
    async function callLLM(text, instruction) {
        showLoading();
        
        try {
            // Replace with your actual Hugging Face API token
            const API_TOKEN = "hf_your_huggingface_token"; // You'll need to add your token here
            
            // Using Mistral-7B model
            const response = await fetch(
                "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
                {
                    headers: {
                        "Authorization": `Bearer ${API_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: `<s>[INST] ${instruction}:\n\n${text} [/INST]`
                    })
                }
            );

            const result = await response.json();
            hideLoading();
            
            if (result.error) {
                return `Error: ${result.error}`;
            }
            
            // Extract only the generated text part, removing the instruction
            let generatedText = result[0].generated_text;
            const instructionEnd = generatedText.indexOf('[/INST]');
            if (instructionEnd !== -1) {
                generatedText = generatedText.substring(instructionEnd + 7).trim();
            }
            
            return generatedText;
        } catch (error) {
            hideLoading();
            return `An error occurred: ${error.message}. Please try again.`;
        }
    }

    // Show/hide loading indicator
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }

    // Button click handlers
    summarizeBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        const result = await callLLM(text, "Summarize the following text in a concise way");
        outputText.innerHTML = result;
    });

    reformatBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        const result = await callLLM(text, "Reformat the following text as a list of bullet points capturing the key ideas");
        outputText.innerHTML = result;
    });

    simplifyBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        const result = await callLLM(text, "Simplify the following text to be easier to understand, using simpler language");
        outputText.innerHTML = result;
    });

    creativeBtn.addEventListener('click', async () => {
        const text = userTextArea.value;
        if (!text.trim()) {
            outputText.innerHTML = 'Please enter or select some text first.';
            return;
        }
        
        const result = await callLLM(text, "Transform the following text into a creative, engaging, and slightly dramatic version while preserving the main ideas");
        outputText.innerHTML = result;
    });
});
