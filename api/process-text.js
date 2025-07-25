// api/process-text.js - Updated with alternative models
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
    
    if (!API_TOKEN) {
      console.error('Missing HUGGINGFACE_API_TOKEN environment variable');
      return res.status(500).json({ error: 'Server configuration error: Missing API token' });
    }

    // List of models to try in order (some are more accessible than others)
    const models = [
      "meta-llama/Meta-Llama-3-8B-Instruct",
      "mistralai/Mistral-7B-Instruct-v0.2", 
      "google/flan-t5-large",
      "tiiuae/falcon-7b-instruct"
    ];

    let result;
    let errorMessages = [];
    
    // Try each model until one works
    for (const model of models) {
      try {
        console.log(`Attempting to use model: ${model}`);
        
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${model}`,
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

        result = await response.json();
        
        // If there's no error, we found a working model
        if (!result.error) {
          console.log(`Successfully used model: ${model}`);
          break;
        } else {
          errorMessages.push(`${model}: ${result.error}`);
        }
      } catch (modelError) {
        errorMessages.push(`${model}: ${modelError.message}`);
      }
    }
    
    // If we tried all models and all had errors
    if (result.error) {
      console.error('All models failed:', errorMessages);
      return res.status(500).json({ 
        error: `Failed to access any model. Last error: ${result.error}`,
        allErrors: errorMessages
      });
    }
    
    // Extract the generated text
    let generatedText = result[0].generated_text;
    const instructionEnd = generatedText.indexOf('[/INST]');
    if (instructionEnd !== -1) {
      generatedText = generatedText.substring(instructionEnd + 7).trim();
    }
    
    return res.status(200).json({ output: generatedText });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
}
