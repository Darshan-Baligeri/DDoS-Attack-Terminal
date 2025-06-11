# 🌐 Cyber Security Terminal Simulator
## Would be nicer to add the Aim of the Project as well

![Version](https://img.shields.io/badge/version-1.2.0-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Overview

This project provides a hacker-style terminal interface for sending network traffic analysis data to a target system. It consists of a stylish frontend interface built with HTML, CSS, and JavaScript, paired with a Node.js/Express backend that handles the secure transmission of data.

### ✨ Features

- 🖥️ **Realistic Terminal Interface**: Command line style UI with typing animations and visual effects
- 🌐 **Client-Server Architecture**: Local Node.js server acts as a relay to bypass browser security restrictions
- 🔒 **Secure Communication**: Proper error handling and timeout management for robust communication
- 📊 **Traffic Analysis**: Sends structured JSON network traffic data for analysis
- 🎮 **Command History**: Navigate through previous commands with arrow keys
- 📝 **Tab Completion**: Quick completion of commands
- 🔄 **Live Status**: Real-time connection status and clock

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository or download the files:**

   ```bash
   git clone https://github.com/yourusername/cyber-terminal.git
   cd cyber-terminal
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Configure the target:**

   Edit the `config.json` file (will be created automatically if it doesn't exist) or set the target URL in `server.js`:

   ```json
   {
     "url": "http://target-machine-ip:3000/detect",
     "timeout": 5000
   }
   ```

4. **Start the server:**

   ```bash
   node server.js
   ```

5. **Access the terminal interface:**

   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## 📖 Using the Terminal

The terminal interface supports the following commands:

| Command | Description |
|---------|-------------|
| `help` | Shows available commands |
| `clear` | Clears the terminal screen |
| `status` | Checks system connection status |
| `scan` | Runs a simulated target system scan |
| `payload` | Shows the JSON data to be sent |
| `target` | Displays target system information |
| `version` | Shows the terminal version information |
| `attack!` | Deploys the network traffic payload to the target |

### Keyboard Shortcuts

- `Tab` - Autocomplete commands
- `↑` `↓` - Navigate through command history
- `Ctrl+L` - Clear terminal (like in Unix/Linux terminals)

## 🔧 Project Structure

```
cyber-terminal/
├── index.html          # Terminal frontend structure
├── style.css           # Terminal styling and visual effects
├── script.js           # Frontend logic and command handling
├── server.js           # Backend server for communication
├── config.json         # Target configuration
└── package.json        # Node.js dependencies
```

## 🛠️ Customization

### Changing the JSON Payload

The network traffic data payload is defined in `script.js`. Edit the `jsonData` object to modify the data being sent:

```javascript
const jsonData = {
    "Destination Port": 80,
    "Flow Duration": 1073206,
    // ...other fields
};
```

### Styling

The terminal appearance can be customized by modifying `style.css`. Key styling elements include:

- Color scheme (background, text colors)
- Terminal dimensions
- Font styles
- Animation effects

### Backend Configuration

Advanced server settings can be adjusted in `server.js`:

- Change the listening port by setting the `PORT` environment variable
- Adjust request timeout settings
- Configure CORS settings for development

## 🔍 Technical Details

### Communication Flow

1. The frontend sends the JSON data to the local backend server (`/send-json` endpoint)
2. The backend server forwards the request to the target system
3. The response from the target is returned to the frontend
4. The frontend displays the response in the terminal UI

### Error Handling

The system includes comprehensive error handling for various scenarios:

- Target server not responding
- Timeout errors
- Invalid responses
- Network connectivity issues

## 🔒 Security Notes

This project is designed for educational purposes and authorized penetration testing. Ensure you have permission to send traffic analysis data to the target system.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>
    <strong>Made with ❤️ by Darshan J Baligeri</strong>
  </p>
  <p>
    <a href="https://github.com/Darshan-Baligeri">GitHub</a> •
    <a href="https://linkedin.com/in/darshan-j-194119198/">LinkedIn</a>
  </p>
</div>
