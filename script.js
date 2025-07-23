// script.js with improved error handling
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

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

        console.log('Sending request to API with prompt:', message);

        // Call your serverless API endpoint
        fetch('/api/llm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message })
        })
        .then(response => {
            console.log('API Response status:', response.status);
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('API Error details:', text);
                    throw new Error(`API error: ${response.status} ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response data:', data);
            
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Check if data has the expected structure
            if (data && Array.isArray(data) && data.length > 0 && data[0].generated_text) {
                // Add bot response
                addMessage(data[0].generated_text, 'bot');
            } else {
                console.error('Unexpected API response format:', data);
                addMessage("The AI model returned an unexpected response format. Please try again.", 'bot');
            }
        })
        .catch(error => {
            console.error('Error details:', error);
            
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Show detailed error
            addMessage(`Sorry, there was an error: ${error.message}`, 'bot');
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
