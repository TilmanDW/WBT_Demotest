// API configuration with environment variables
const API_CONFIG = {
    token: process.env.HUGGINGFACE_API_TOKEN,
    models: {
        summarize: 'facebook/bart-large-cnn',
        reformat: 'microsoft/DialoGPT-large',
        adjust: 'microsoft/DialoGPT-large'
    }
};

// Server-side API handler for Vercel
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, action } = req.body;
    
    if (!prompt || !action) {
        return res.status(400).json({ error: 'Missing prompt or action' });
    }

    try {
        const model = API_CONFIG.models[action] || API_CONFIG.models.summarize;
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 200,
                    temperature: 0.7,
                    do_sample: true
                },
                options: {
                    wait_for_model: true
                }
            })
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API request failed');
        }

        res.status(200).json({ result });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
