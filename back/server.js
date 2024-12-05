const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enable cors for all routes
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Set up Anthropic configuration
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // Store your Anthropic API key in the .env file
});

// Handle pre-flight requests
app.options('/chatbot', cors());

// Define the chatbot endpoint
app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // You can change to claude-3-sonnet or claude-3-opus
      max_tokens: 1000,
      system: "You are an expert on Gatling load testing and programming. Always return a code example and a graph for the requested load profile. If no programming language is specified, default to Java. Only use code and information from https://docs.gatling.io and Gatling GitHub repositories: https://github.com/gatling. No other sources are allowed. ",
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const chatbotMessage = response.content[0].text;
    res.json({ reply: chatbotMessage });
  } catch (error) {
    if (error.response) {
      console.error('Anthropic API error:', error.response.status, error.response);
      res.status(error.response.status).json({ error: error.response });
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Chatbot API is running on http://localhost:${port}`);
});