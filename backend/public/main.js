const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const themeToggle = document.getElementById('theme-toggle');
let isDarkMode = false;
let messageHistory = [];
let editingMessageId = null;

// Add after isDarkMode declaration
isDarkMode = localStorage.getItem('theme') === 'dark';

// Function to append a chat message
function appendMessage(content, sender, messageId = Date.now()) {
    const message = document.createElement('div');
    message.classList.add('chat-message', 'message-with-actions');
    message.dataset.messageId = messageId;
    
    if (sender === 'bot error') {
        message.classList.add('bot', 'error');
    } else {
        message.classList.add(sender);
    }
    
    // Create message content container
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    // Format the message content
    if (content.includes('Key Points:')) {
        const sections = content.split('\n\n');
        const formattedContent = sections.map(section => {
            if (section.startsWith('Key Points:')) {
                const points = section.split('\n');
                return `<strong>${points[0]}</strong><br>` + 
                       points.slice(1).join('<br>');
            }
            return section;
        }).join('<br><br>');
        
        messageContent.innerHTML = formattedContent;
    } else {
        messageContent.innerHTML = content.split('\n').join('<br>');
    }
    
    // Add message actions
    if (sender === 'user') {
        const actions = document.createElement('div');
        actions.classList.add('message-actions');
        
        // Add edit button
        const editBtn = document.createElement('button');
        editBtn.classList.add('action-button');
        editBtn.innerHTML = '<span class="material-icons">edit</span>';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            startEditing(messageId);
        };
        actions.appendChild(editBtn);

        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.classList.add('action-button');
        copyBtn.innerHTML = '<span class="material-icons">content_copy</span>';
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(content);
            const tooltip = document.createElement('div');
            tooltip.classList.add('copy-tooltip');
            tooltip.textContent = 'Copied!';
            actions.appendChild(tooltip);
            setTimeout(() => tooltip.classList.add('show'), 100);
            setTimeout(() => tooltip.remove(), 2000);
        };
        actions.appendChild(copyBtn);
        message.appendChild(actions);
    }
    
    message.appendChild(messageContent);
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    message.appendChild(timestamp);
    
    chatBox.appendChild(message);
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
    });

    // Store message in history
    messageHistory.push({
        id: messageId,
        content,
        sender,
        timestamp: new Date()
    });
}

// Event listener for sending messages
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add theme toggle functionality
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = `<span class="material-icons">${isDarkMode ? 'light_mode' : 'dark_mode'}</span>`;
});

// Set initial theme
document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
themeToggle.innerHTML = `<span class="material-icons">${isDarkMode ? 'light_mode' : 'dark_mode'}</span>`;

// Update the loading message creation
function createLoadingMessage() {
    const loadingMessage = document.createElement('div');
    loadingMessage.classList.add('chat-message', 'bot', 'loading');
    const content = document.createElement('span');
    content.textContent = 'Typing';
    content.classList.add('loading-dots');
    loadingMessage.appendChild(content);
    return loadingMessage;
}

// Add function to start editing
function startEditing(messageId) {
    const messageToEdit = messageHistory.find(m => m.id === messageId);
    if (!messageToEdit || messageToEdit.sender !== 'user') return;

    editingMessageId = messageId;
    userInput.value = messageToEdit.content;
    userInput.focus();
    
    // Change send button to update button
    sendButton.innerHTML = '<span class="material-icons">update</span>';
    
    // Add cancel button
    if (!document.getElementById('cancel-edit')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-edit';
        cancelBtn.innerHTML = '<span class="material-icons">close</span>';
        cancelBtn.onclick = cancelEditing;
        document.querySelector('.input-wrapper').insertBefore(cancelBtn, sendButton);
    }
}

// Add function to cancel editing
function cancelEditing() {
    editingMessageId = null;
    userInput.value = '';
    sendButton.innerHTML = '<span class="material-icons">send</span>';
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) cancelBtn.remove();
}

// Update sendMessage function to handle edits
async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    if (editingMessageId) {
        // Remove all messages after the edited message
        const editIndex = messageHistory.findIndex(m => m.id === editingMessageId);
        if (editIndex !== -1) {
            const messagesToRemove = messageHistory.slice(editIndex);
            messagesToRemove.forEach(msg => {
                const element = document.querySelector(`[data-message-id="${msg.id}"]`);
                if (element) element.remove();
            });
            messageHistory = messageHistory.slice(0, editIndex);
        }
        cancelEditing();
    }

    // Get the last bot message
    const lastBotMessage = Array.from(chatBox.children)
        .filter(msg => msg.classList.contains('bot'))
        .pop()?.querySelector('.message-content')?.textContent || '';

    // Add user's message to the chat
    appendMessage(userMessage, 'user');
    userInput.value = '';
    
    // Show loading indicator
    const loadingMessage = createLoadingMessage();
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
    });

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: userMessage,
                lastBotMessage: lastBotMessage,
                editingMessageId: editingMessageId
            }),
        });

        const data = await response.json();
        
        // Remove loading message
        loadingMessage.remove();

        if (data.botMessage) {
            appendMessage(data.botMessage, 'bot');
        } else if (data.error) {
            appendMessage(data.error, 'bot error');
            
            if (data.retry) {
                setTimeout(() => {
                    appendMessage("Let me try that again...", 'bot');
                    sendMessage();
                }, 3000);
            }
        } else {
            appendMessage("Sorry, something went wrong.", 'bot error');
        }
    } catch (error) {
        loadingMessage.remove();
        appendMessage("Sorry, I'm having trouble connecting right now. Please try again later.", 'bot error');
        console.error('Error:', error);
    }
}

// Add this function
function addWelcomeMessage() {
    setTimeout(() => {
        appendMessage("👋 Welcome to Budget Buddy AI! I'm here to help you with financial advice. Feel free to ask me anything about:", 'bot');
        setTimeout(() => {
            appendMessage("1) Investing & Trading\n2) Budgeting & Saving\n3) Tax Planning\n4) Retirement Planning\n5) Debt Management", 'bot');
        }, 1000);
    }, 500);
}

// Call welcome message on every page load
document.addEventListener('DOMContentLoaded', addWelcomeMessage);

// Add this after your existing code
document.querySelector('.bot-icon').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.1) rotate(5deg)';
});

document.querySelector('.bot-icon').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
});
