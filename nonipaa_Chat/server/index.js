const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenRouter setup
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173/',
    'X-Title': 'My Custom Chatbot'
  }
});

// POST /chat route
app.post('/chat', async (req, res) => {
  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: model || 'openai/gpt-3.5-turbo',
      messages: messages,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('❌ OpenRouter Error:', error);
    res.status(500).json({ error: 'AI response error' });
  }
});

app.listen(3001, () => {
  console.log('✅ Server started at http://localhost:3001');
});
