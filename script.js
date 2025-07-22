// script.js
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

        // Call your serverless API endpoint
        fetch('/api/llm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Remove loading message
            document.getElementById(loadingId).remove();
            
            // Extract response text
            const botResponse = data[0]?.generated_text || 'No response generated.';
            
            // Add bot response
            addMessage(botResponse, 'bot');
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
