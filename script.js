document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Use a free model from Hugging Face
    const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
    
    // You'll need to replace this with your own Hugging Face API key
    // Get one for free at https://huggingface.co/settings/tokens
    const API_KEY = "YOUR_HUGGING_FACE_API_KEY";

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';

        // Show loading indicator
        const loadingId = addMessage('Thinking...', 'bot');

        // Call API
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: message,
                options: {
                    wait_for_model: true
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Add bot response
            addMessage(data[0].generated_text, 'bot');
        })
        .catch(error => {
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Show error
            addMessage('Sorry, there was an error. Please try again.', 'bot');
            console.error('Error:', error);
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        const id = 'msg-' + Date.now();
        messageDiv.id = id;
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return id;
    }
});
