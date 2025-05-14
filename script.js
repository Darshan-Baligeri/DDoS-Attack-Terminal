// script.js - Enhanced terminal functionality
const terminalOutput = document.getElementById('terminalOutput');
const commandInput = document.getElementById('commandInput');
const statusBar = document.getElementById('statusBar');
const clockElement = document.getElementById('clock');
const connectionStatus = document.getElementById('connectionStatus');
const promptSpan = document.querySelector('.terminal-input .prompt');

// JSON traffic data payload
const jsonData = {
    "Destination Port": 80,
    "Flow Duration": 1073206,
    "Total Fwd Packets": 3,
    "Total Backward Packets": 7,
    "Total Length of Fwd Packets": 26,
    "Total Length of Bwd Packets": 11601,
    "Fwd Packet Length Max": 20,
    "Fwd Packet Length Min": 0,
    "Fwd Packet Length Mean": 8.666666667,
    "Fwd Packet Length Std": 10.26320288,
    "Bwd Packet Length Max": 2920,
    "Bwd Packet Length Min": 0,
    "Bwd Packet Length Mean": 1657.285714,
    "Bwd Packet Length Std": 1299.172136,
    "Flow Bytes/s": 10833.89396,
    "Flow Packets/s": 9.317875599,
    "Flow IAT Mean": 119245.1111,
    "Flow IAT Std": 354417.6089,
    "Flow IAT Max": 1064334,
    "Flow IAT Min": 2,
    "Fwd IAT Total": 8014,
    "Fwd IAT Mean": 4007,
    "Fwd IAT Std": 5663.925317,
    "Fwd IAT Max": 8012,
    "Fwd IAT Min": 2,
    "Bwd IAT Total": 1073079,
    "Bwd IAT Mean": 178846.5,
    "Bwd IAT Std": 433810.8858,
    "Bwd IAT Max": 1064334,
    "Bwd IAT Min": 11,
    "Fwd PSH Flags": 0,
    "Bwd PSH Flags": 0,
    "Fwd URG Flags": 0,
    "Bwd URG Flags": 0,
    "Fwd Header Length": 72,
    "Bwd Header Length": 152,
    "Fwd Packets/s": 2.79536268,
    "Bwd Packets/s": 6.522512919,
    "Min Packet Length": 0,
    "Max Packet Length": 2920,
    "Packet Length Mean": 1057,
    "Packet Length Std": 1306.290856,
    "Packet Length Variance": 1706395.8,
    "FIN Flag Count": 0,
    "SYN Flag Count": 0,
    "RST Flag Count": 0,
    "PSH Flag Count": 1,
    "ACK Flag Count": 0,
    "URG Flag Count": 0,
    "CWE Flag Count": 0,
    "ECE Flag Count": 0,
    "Down/Up Ratio": 0,
    "Average Packet Size": 0,
    "Avg Fwd Segment Size": 0,
    "Avg Bwd Segment Size": 0,
    "Fwd Header Length.1": 0,
    "Fwd Avg Bytes/Bulk": 0,
    "Fwd Avg Packets/Bulk": 0,
    "Fwd Avg Bulk Rate": 0,
    "Bwd Avg Bytes/Bulk": 0,
    "Bwd Avg Packets/Bulk": 0,
    "Bwd Avg Bulk Rate": 0,
    "Subflow Fwd Packets": 0,
    "Subflow Fwd Bytes": 0,
    "Subflow Bwd Packets": 0,
    "Subflow Bwd Bytes": 0,
    "Init_Win_bytes_forward": 0,
    "Init_Win_bytes_backward": 0,
    "act_data_pkt_fwd": 0,
    "min_seg_size_forward": 0,
    "Active Mean": 0,
    "Active Std": 0,
    "Active Max": 0,
    "Active Min": 0,
    "Idle Mean": 0,
    "Idle Std": 0,
    "Idle Max": 0,
    "Idle Min": 0
};

// Command history functionality
let commandHistory = [];
let historyIndex = -1;

// Update digital clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Initialize clock and update every second
updateClock();
setInterval(updateClock, 1000);

// Add lines to terminal with optional class for styling
function addLineToOutput(text, cssClass = null, isCommand = false) {
    const line = document.createElement('div');
    line.classList.add('line');
    
    if (cssClass) {
        line.classList.add(cssClass);
    }
    
    if (isCommand) {
        line.innerHTML = `<span class="prompt">${promptSpan.textContent}</span>${text}`;
    } else {
        line.textContent = text;
    }
    
    terminalOutput.appendChild(line);
    // Auto-scroll to the bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Create progress bar for visual effect
function createProgressBar() {
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-bar');
    
    const progressBarFill = document.createElement('div');
    progressBarFill.classList.add('progress-bar-fill');
    
    const progressText = document.createElement('div');
    progressText.classList.add('progress-text');
    progressText.textContent = '0%';
    
    progressBarContainer.appendChild(progressBarFill);
    progressBarContainer.appendChild(progressText);
    terminalOutput.appendChild(progressBarContainer);
    
    return { container: progressBarContainer, fill: progressBarFill, text: progressText };
}

// Simulate progress animation
function simulateProgress(durationMs = 2000, onComplete = () => {}) {
    const progressBar = createProgressBar();
    let startTime = null;
    
    function updateProgress(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const percentage = Math.floor(progress * 100);
        
        progressBar.fill.style.width = `${percentage}%`;
        progressBar.text.textContent = `${percentage}%`;
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            setTimeout(() => {
                onComplete();
            }, 300);
        }
    }
    
    requestAnimationFrame(updateProgress);
    return progressBar.container;
}

// Add JSON display with proper formatting
function addJsonDisplay(jsonData) {
    const jsonDisplay = document.createElement('div');
    jsonDisplay.classList.add('json-display');
    
    // Format JSON with 2-space indentation
    const formattedJson = JSON.stringify(jsonData, null, 2);
    jsonDisplay.textContent = formattedJson;
    
    terminalOutput.appendChild(jsonDisplay);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Handle key events for command history and input
commandInput.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        navigateHistory('up');
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        navigateHistory('down');
    } else if (event.key === 'Tab') {
        event.preventDefault();
        autocompleteCommand();
    }
});

// Command history navigation
function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
        historyIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
    } else {
        historyIndex = historyIndex > 0 ? historyIndex - 1 : -1;
    }
    
    commandInput.value = historyIndex >= 0 ? commandHistory[historyIndex] : '';
}

// Simple command autocomplete
function autocompleteCommand() {
    const input = commandInput.value.toLowerCase();
    const commands = ['help', 'clear', 'status', 'scan', 'attack!', 'payload', 'target', 'version'];
    
    for (const cmd of commands) {
        if (cmd.startsWith(input)) {
            commandInput.value = cmd;
            break;
        }
    }
}

// Handle command input
commandInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const command = commandInput.value.trim();
        
        if (command) {
            // Add to history at the beginning
            commandHistory.unshift(command);
            historyIndex = -1;
            
            // Limit history size
            if (commandHistory.length > 20) {
                commandHistory.pop();
            }
        }
        
        addLineToOutput(command, null, true); // Add command to output with prompt
        commandInput.value = ''; // Clear input
        
        // Process the command
        handleCommand(command);
    }
});

// Process commands
async function handleCommand(command) {
    if (!command) return;
    
    switch (command.toLowerCase()) {
        case 'clear':
            terminalOutput.innerHTML = ''; // Clear output
            addLineToOutput("Terminal cleared.", 'info');
            break;
            
        case 'help':
            addLineToOutput("Available commands:", 'info');
            addLineToOutput("  clear      - Clear the terminal");
            addLineToOutput("  status     - Check system connection status");
            addLineToOutput("  scan       - Run target system scan");
            addLineToOutput("  payload    - Show payload to be sent");
            addLineToOutput("  target     - Show target information");
            addLineToOutput("  version    - Show terminal version");
            addLineToOutput("  attack!    - Deploy the network traffic payload");
            break;
            
        case 'status':
            addLineToOutput("Checking system status...", 'info');
            await simulateTyping([
                "Connection: Active",
                "Backend server: Running",
                "Target availability: Online",
                "Network latency: 12ms",
                "Payload integrity: Verified"
            ]);
            connectionStatus.innerHTML = '<span style="color:#27c93f;">●</span> Connected';
            break;
            
        case 'scan':
            addLineToOutput("Initiating target system scan...", 'info');
            const progressBar = simulateProgress(3000, () => {
                addLineToOutput("Scan complete.", 'success');
                addLineToOutput("Target system vulnerability assessment:", 'info');
                addLineToOutput("- Port 3000: OPEN");
                addLineToOutput("- Service: HTTP Server");
                addLineToOutput("- Server type: Node.js/Express");
                addLineToOutput("- API endpoint: /detect");
                addLineToOutput("- Status: Ready for payload");
            });
            break;
            
        case 'payload':
            addLineToOutput("Network traffic payload loaded:", 'info');
            addJsonDisplay(jsonData);
            break;
            
        case 'target':
            // Get the target URL from a hidden config or fetch from backend
            addLineToOutput("Target information:", 'info');
            addLineToOutput("- Protocol: HTTP");
            addLineToOutput("- Host: [Target system IP address]");
            addLineToOutput("- Port: 3000");
            addLineToOutput("- Endpoint: /detect");
            addLineToOutput("- Method: POST");
            break;
            
        case 'version':
            addLineToOutput("SECURE-TERMINAL v1.2", 'info');
            addLineToOutput("© 2025 Secure Systems Research");
            break;
            
        case 'attack!':
            addLineToOutput("Initiating payload deployment...", 'warning');
            connectionStatus.innerHTML = '<span style="color:#ffbd2e;">●</span> Sending...';
            
            // Simulate pre-request activity
            await simulateTyping([
                "Preparing payload...",
                "Establishing secure channel...",
                "Encrypting traffic..."
            ]);
            
            // Show visual progress
            const attackProgress = simulateProgress(2000, async () => {
                await sendJsonPayload();
            });
            break;
            
        default:
            addLineToOutput(`Command not recognized: ${command}`, 'error');
            addLineToOutput("Type 'help' for available commands.");
    }
}

// Simulated typing animation
function simulateTyping(lines) {
    return new Promise(resolve => {
        let lineIndex = 0;
        let charIndex = 0;
        let currentLineElement = null;
        const typingSpeed = 20; // milliseconds per character
        const lineDelay = 300; // delay between lines
        
        function type() {
            if (lineIndex < lines.length) {
                if (charIndex === 0) {
                    // Create new line element
                    currentLineElement = document.createElement('div');
                    currentLineElement.classList.add('line');
                    terminalOutput.appendChild(currentLineElement);
                }
                
                if (charIndex < lines[lineIndex].length) {
                    currentLineElement.textContent += lines[lineIndex][charIndex];
                    charIndex++;
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    setTimeout(type, typingSpeed);
                } else {
                    lineIndex++;
                    charIndex = 0;
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    setTimeout(type, lineDelay);
                }
            } else {
                resolve();
            }
        }
        
        type();
    });
}

// Send JSON payload to the backend server
async function sendJsonPayload() {
    addLineToOutput("Sending traffic analysis payload to target...", 'warning');
    
    try {
        // Send the request with error handling and timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch('/send-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const result = await response.json();
            connectionStatus.innerHTML = '<span style="color:#27c93f;">●</span> Connected';
            
            addLineToOutput("Payload delivered successfully!", 'success');
            addLineToOutput("Target response received:", 'info');
            
            // Display the response in a formatted way
            addJsonDisplay(result);
            
            // Add a summary based on the result
            if (result.detection) {
                addLineToOutput(`Detection result: ${result.detection}`, 'warning');
            }
            
            if (result.confidence) {
                addLineToOutput(`Confidence: ${result.confidence}%`, 'info');
            }
        } else {
            connectionStatus.innerHTML = '<span style="color:#ff5f56;">●</span> Error';
            
            const errorData = await response.text();
            addLineToOutput(`Error sending payload. Status: ${response.status}`, 'error');
            addLineToOutput(`Server response: ${errorData}`, 'error');
        }
    } catch (error) {
        connectionStatus.innerHTML = '<span style="color:#ff5f56;">●</span> Disconnected';
        
        if (error.name === 'AbortError') {
            addLineToOutput("Request timed out. Target server not responding.", 'error');
        } else {
            addLineToOutput("Connection error:", 'error');
            addLineToOutput(`${error.message}`, 'error');
            addLineToOutput("Check that the backend server is running.", 'info');
        }
    }
}

// Handle clicks on terminal area to focus input
document.querySelector('.terminal-container').addEventListener('click', () => {
    commandInput.focus();
});

// Initialize terminal on page load
window.addEventListener('load', () => {
    commandInput.focus();
    
    // Prevent default behavior for Ctrl+L (clear in real terminals)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            handleCommand('clear');
        }
    });
});