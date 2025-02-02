// Calendar Generation

function generateCalendar(courses = []) {
    const calendarGrid = document.querySelector('.calendar-grid');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const timeSlots = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

    // Clear existing calendar if any
    calendarGrid.innerHTML = '';

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

    // Replace hardcoded course blocks with dynamic course data
    courses.forEach(course => {
        course.schedule.forEach(slot => {
            addCourseBlock(
                course.name,
                course.classCode,  // This should be a URL-safe class code for CSS
                slot.day,
                slot.startTime,
                slot.duration
            );
        });
    });
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

        if (!this.hasStartedChat) {
            this.transitionToChatInterface();
        }

        this.addMessageToChat('user', message);
        this.chatInput.value = '';
        this.showTypingIndicator();

        // Here we'll process the LLM response and update the calendar
        try {
            const aiResponse = await this.getAIResponse(message);
            this.removeTypingIndicator();
            this.addMessageToChat('ai', aiResponse.message);
            
            // Update calendar if courses are provided
            if (aiResponse.courses && Array.isArray(aiResponse.courses)) {
                generateCalendar(aiResponse.courses);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            this.removeTypingIndicator();
            this.addMessageToChat('ai', 'Sorry, I encountered an error processing your request.');
        }
    }

    async getAIResponse(message) {
        // Replace this with your actual LLM API call
        // Example response format:
        return {
            message: "I've updated your schedule with those courses.",
            courses: [
                {
                    name: "ME 101",
                    classCode: "me101",
                    schedule: [
                        { day: "Mon", startTime: "11 AM", duration: 2 },
                        { day: "Wed", startTime: "11 AM", duration: 2 }
                    ]
                },
                // ... more courses ...
            ]
        };
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
}

// Update initialization
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();  // Initial empty calendar
    const chat = new ChatWindow();
}); 
