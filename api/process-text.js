// api/process-text.js - Using CommonJS syntax
module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, instruction } = req.body;
    
    if (!text || !instruction) {
      return res.status(400).json({ error: 'Text and instruction are required' });
    }

    // Get API token from environment variable
    const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
    
    if (!API_TOKEN) {
      console.error('Missing HUGGINGFACE_API_TOKEN environment variable');
      return res.status(500).json({ error: 'Server configuration error: Missing API token' });
    }

    // Try a more reliable model from Hugging Face
    try {
      const fetch = require('node-fetch');
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({
            inputs: text,
            parameters: {
              max_length: 100,
              min_length: 30
            }
          })
        }
      );

      const result = await response.json();
      
      if (result.error) {
        console.error('Error from Hugging Face API:', result.error);
        return res.status(500).json({ error: `Hugging Face API error: ${result.error}` });
      }
      
      return res.status(200).json({ output: result[0].summary_text });
    } catch (modelError) {
      console.error('Error calling model:', modelError);
      return res.status(500).json({ error: `Model error: ${modelError.message}` });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};
