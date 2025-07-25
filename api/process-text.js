// api/process-text.js
export default async function handler(req, res) {
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
    
    // Better error handling for missing token
    if (!API_TOKEN) {
      console.error('Missing HUGGINGFACE_API_TOKEN environment variable');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing API token',
        envVars: Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('TOKEN')).join(', ')
      });
    }

    console.log('Calling Hugging Face API with token length:', API_TOKEN.length);

    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `<s>[INST] ${instruction}:\n\n${text} [/INST]`
        })
      }
    );

    const result = await response.json();
    
    if (result.error) {
      console.error('Error from Hugging Face API:', result.error);
      return res.status(500).json({ error: `Hugging Face API error: ${result.error}` });
    }
    
    // Extract the generated text
    let generatedText = result[0]?.generated_text;
    
    if (!generatedText) {
      console.error('Unexpected response format:', JSON.stringify(result));
      return res.status(500).json({ error: 'Unexpected response format from API' });
    }
    
    const instructionEnd = generatedText.indexOf('[/INST]');
    if (instructionEnd !== -1) {
      generatedText = generatedText.substring(instructionEnd + 7).trim();
    }
    
    return res.status(200).json({ output: generatedText });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: `An error occurred: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
