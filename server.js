// server.js - Improved backend server with better error handling and logging
const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5010;

// Read configuration from file or set default
let targetConfig = {
    url: 'http://localhost:3000/detect',
    timeout: 5000  // 5 seconds timeout
};

// Try to load config from file if exists
try {
    if (fs.existsSync('./config.json')) {
        const configFile = fs.readFileSync('./config.json', 'utf8');
        const loadedConfig = JSON.parse(configFile);
        targetConfig = { ...targetConfig, ...loadedConfig };
        console.log('Config loaded successfully');
    }
} catch (error) {
    console.warn('Could not load config file, using defaults:', error.message);
}

// Middleware
app.use(bodyParser.json({ limit: '1mb' })); // Increased limit for larger JSON
app.use(express.static(path.join(__dirname))); // Serve static files from current directory

// Enable CORS for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Middleware to log all requests
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Route to get target configuration (for frontend to display)
app.get('/config', (req, res) => {
    // Send a sanitized version (no sensitive info)
    const safeConfig = {
        targetHost: new URL(targetConfig.url).hostname,
        targetPort: new URL(targetConfig.url).port || '80',
        targetPath: new URL(targetConfig.url).pathname
    };

    res.json(safeConfig);
});

// Route to send JSON to target system
app.post('/send-json', async (req, res) => {
    console.log('📤 Received request from frontend to send JSON payload');
    const jsonData = req.body;

    if (!jsonData || Object.keys(jsonData).length === 0) {
        console.error('❌ No JSON data received from frontend');
        return res.status(400).json({ error: 'No JSON data provided' });
    }

    console.log(`🎯 Target URL: ${targetConfig.url}`);
    
    // Log abbreviated payload to keep console clean
    const keysCount = Object.keys(jsonData).length;
    console.log(`📦 Payload: ${keysCount} fields of traffic analysis data`);

    try {
        // Send the JSON data to the target with timeout
        const targetResponse = await axios.post(targetConfig.url, jsonData, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'SecureTerminal/1.2'
            },
            timeout: targetConfig.timeout
        });

        console.log('✅ Successfully sent data to target');
        console.log(`📊 Response status: ${targetResponse.status}`);
        
        // Log abbreviated response
        if (targetResponse.data) {
            console.log('📥 Response data received');
        }

        // Add some useful metadata to the response
        const enhancedResponse = {
            ...targetResponse.data,
            _meta: {
                timestamp: new Date().toISOString(),
                requestId: Math.random().toString(36).substring(2, 10),
                targetServer: new URL(targetConfig.url).hostname
            }
        };

        // Send the response back to the frontend
        res.status(targetResponse.status).json(enhancedResponse);

    } catch (error) {
        console.error('❌ Error sending data to target:');

        if (error.response) {
            // The target server responded with an error status
            console.error(`⚠️ Target returned status code ${error.response.status}`);
            
            return res.status(error.response.status).json({
                error: 'Error from target server',
                status: error.response.status,
                details: error.response.data || 'No detailed error message provided'
            });
        } 
        else if (error.request) {
            // Request was made but no response received (timeout, server down, etc.)
            console.error('⏱️ No response received from target server');
            
            // Be more descriptive about connection issues
            let errorDetail = 'Target server not responding';
            if (error.code === 'ECONNREFUSED') {
                errorDetail = 'Connection refused - target server is not running or port is blocked';
            } else if (error.code === 'ETIMEDOUT' || error.code === 'TIMEOUT') {
                errorDetail = 'Connection timed out - target server is taking too long to respond';
            } else if (error.code === 'ENOTFOUND') {
                errorDetail = 'DNS lookup failed - hostname could not be resolved';
            }
            
            return res.status(504).json({
                error: 'Gateway Timeout',
                message: errorDetail,
                code: error.code
            });
        } 
        else {
            // Something else happened during request setup
            console.error('🔧 Error in request setup:', error.message);
            
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to send request to target',
                details: error.message
            });
        }
    }
});

// API endpoint to save target configuration
app.post('/update-config', (req, res) => {
    const { targetUrl } = req.body;
    
    if (!targetUrl) {
        return res.status(400).json({ error: 'Invalid configuration - URL required' });
    }
    
    try {
        // Validate URL format
        new URL(targetUrl);
        
        // Update the target URL
        targetConfig.url = targetUrl;
        
        // Save to config file for persistence
        fs.writeFileSync(
            './config.json', 
            JSON.stringify({ url: targetUrl }, null, 2), 
            'utf8'
        );
        
        console.log(`🔄 Target URL updated to: ${targetUrl}`);
        res.json({ success: true, message: 'Configuration updated successfully' });
        
    } catch (error) {
        console.error('❌ Invalid URL format:', error.message);
        res.status(400).json({ error: 'Invalid URL format' });
    }
});

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'up', 
        timestamp: new Date().toISOString() 
    });
});

// Fallback route for any undefined API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Catch-all route to return index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('💥 Unhandled error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
    console.log('\n----------------------------------------------');
    console.log(`🚀 Backend server running at http://localhost:${port}`);
    console.log(`📡 Target system set to: ${targetConfig.url}`);
    console.log('----------------------------------------------\n');
    console.log('To change the target, use POST /update-config or edit config.json');
    console.log('To access the terminal UI, open http://localhost:' + port + ' in your browser');
});