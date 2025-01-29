// Calendar Generation
function generateCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const timeSlots = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-row header';
    
    headerRow.innerHTML = '<div></div>';
    daysOfWeek.forEach(day => {
        headerRow.innerHTML += `<div>${day}</div>`;
    });
    
    calendarGrid.appendChild(headerRow);

    // Create time slots
    timeSlots.forEach(time => {
        const row = document.createElement('div');
        row.className = 'calendar-row';
        row.innerHTML = `<div>${time}</div>`;
        
        for(let i = 0; i < 5; i++) {
            row.innerHTML += '<div class="calendar-cell"></div>';
        }
        
        calendarGrid.appendChild(row);
    });

    // Add course blocks
    addCourseBlock('ME 101', 'me101', 'Mon', '11 AM', 2);
    addCourseBlock('ME 101', 'me101', 'Wed', '11 AM', 2);
    addCourseBlock('ENGR 15', 'engr15', 'Mon', '2 PM', 2);
    addCourseBlock('ENGR 15', 'engr15', 'Wed', '2 PM', 2);
    addCourseBlock('PHIL 60', 'phil60', 'Mon', '4 PM', 2);
    addCourseBlock('PHIL 60', 'phil60', 'Wed', '4 PM', 2);
    addCourseBlock('PHIL 60', 'phil60', 'Fri', '1 PM', 1);
}

function addCourseBlock(courseName, courseClass, day, startTime, duration) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const times = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
    
    const dayIndex = days.indexOf(day);
    const timeIndex = times.indexOf(startTime);
    
    const cells = document.querySelectorAll('.calendar-cell');
    const startCell = cells[dayIndex + (timeIndex * 5)];
    
    const courseBlock = document.createElement('div');
    courseBlock.className = `course-block ${courseClass}`;
    courseBlock.textContent = courseName;
    courseBlock.style.height = `${duration * 45 - 4}px`;
    
    startCell.appendChild(courseBlock);
}

// Chat functionality
class ChatWindow {
    constructor() {
        this.chatMessages = document.querySelector('.chat-messages');
        this.chatInput = document.querySelector('.chat-input input');
        this.sendButton = document.querySelector('.send-btn');
        this.chatHeader = document.querySelector('.chat-header');
        this.suggestionButtons = document.querySelector('.suggestion-buttons');
        this.messageHistory = [];
        this.hasStartedChat = false;
        
        this.init();
    }

    init() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Handle suggestion button clicks
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.chatInput.value = btn.textContent;
                this.sendMessage();
            });
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Remove initial UI if this is the first message
        if (!this.hasStartedChat) {
            this.transitionToChatInterface();
        }

        // Add user message to chat
        this.addMessageToChat('user', message);
        this.chatInput.value = '';

        // Simulate typing indicator
        this.showTypingIndicator();

        // Simulate AI response (replace this with actual API call)
        setTimeout(() => {
            this.removeTypingIndicator();
            this.addMessageToChat('ai', this.generateAIResponse(message));
        }, 1500);
    }

    transitionToChatInterface() {
        // Remove header and suggestion buttons with fade-out effect
        this.chatHeader.style.opacity = '0';
        this.suggestionButtons.style.opacity = '0';
        
        setTimeout(() => {
            this.chatHeader.remove();
            this.suggestionButtons.remove();
        }, 300); // Match this with CSS transition duration

        this.hasStartedChat = true;
    }

    addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';

        const messageContent = document.createElement('p');
        messageContent.textContent = message;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // Store in history
        this.messageHistory.push({ sender, message });
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing';
        typingDiv.innerHTML = `
            <div class="avatar"></div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateAIResponse(message) {
        // This is a simple response generator - replace with actual AI integration
        const responses = [
            "Based on your course requirements, I recommend taking ME 101 and ENGR 15 together.",
            "That's a good question about your schedule. Let me help you with that.",
            "I can help you plan your course load for the upcoming quarter.",
            "Would you like me to explain the prerequisites for this course?",
            "I can show you the typical course sequence for your major."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize both calendar and chat when document loads
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    const chat = new ChatWindow();
}); 