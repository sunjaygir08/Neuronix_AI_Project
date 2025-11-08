document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const typingIndicator = document.getElementById('typing-indicator');
    const themeToggle = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    const htmlEl = document.documentElement;

    // --- Theme Toggle Logic ---
    
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlEl.classList.add('dark');
        darkIcon.classList.remove('hidden');
    } else {
        htmlEl.classList.remove('dark');
        lightIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        if (htmlEl.classList.contains('dark')) {
            // Switch to light mode
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        } else {
            // Switch to dark mode
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        }
    });

    // --- Chatbot Logic ---

    /**
     * Displays a message in the chat window.
     * @param {string} message - The message content.
     * @param {'user' | 'bot'} sender - The sender of the message.
     */
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('flex', 'max-w-xs', 'md:max-w-md', 'p-3', 'rounded-lg', 'shadow-md');
        
        if (sender === 'user') {
            messageElement.classList.add('bg-blue-500', 'text-white', 'self-end', 'ml-auto', 'rounded-br-none');
        } else {
            messageElement.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white', 'self-start', 'rounded-bl-none');
        }
        
        messageElement.innerText = message;
        chatWindow.appendChild(messageElement);
        
        // Scroll to the bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    /**
     * Fetches the bot's response from the Flask backend.
     * @param {string} userMessage - The user's message.
     */
    async function getBotResponse(userMessage) {
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                // Handle HTTP errors
                console.error('Error from server:', response.status, response.statusText);
                return "Sorry, I seem to be having trouble connecting. Please try again.";
            }

            const data = await response.json();
            return data.response;

        } catch (error) {
            // Handle network or fetch errors
            console.error('Fetch error:', error);
            return "I'm offline right now. Please check your connection.";
        }
    }

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userMessage = messageInput.value.trim();
        if (userMessage === '') return; // Don't send empty messages

        // 1. Display user's message
        displayMessage(userMessage, 'user');
        
        // 2. Clear the input
        messageInput.value = '';

        // 3. Show typing indicator
        typingIndicator.classList.remove('hidden');

        // 4. Get and display bot's response from backend
        const botMessage = await getBotResponse(userMessage);
        
        // 5. Hide typing indicator
        typingIndicator.classList.add('hidden');
        
        // 6. Display bot's message
        displayMessage(botMessage, 'bot');
    });

    // Display initial greeting from the bot
    setTimeout(() => {
        displayMessage("Hello! How can I help you today?", 'bot');
        // Make body visible after initial setup
        document.body.style.opacity = 1;
    }, 500); // Short delay to let the page load
});