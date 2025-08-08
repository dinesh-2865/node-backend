const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello root node');
});

// POST endpoint to receive data from the React Native app
app.post('/predict', async (req, res) => {
    try {
        const userData = req.body;

        // Forward the request to the FastAPI server
        const response = await axios.post('http://127.0.0.1:8000/predict', userData);

        // Send prediction back to the React Native app
        res.json({
            prediction: response.data.prediction
        });
    } catch (error) {
        if (error.response) {
            // Log detailed error from FastAPI (422 or other status)
            console.error("Error response from FastAPI:", error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            // Log other types of errors (network, etc.)
            console.error("Error:", error.message);
            res.status(500).json({ error: 'Prediction failed' });
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node.js backend is running at http://localhost:${PORT}`);
});

