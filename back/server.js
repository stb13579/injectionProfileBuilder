const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS with dynamic origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

// Middleware for parsing JSON requests
app.use(express.json());

// Set up Anthropic configuration
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Chatbot endpoint (rest of the code remains the same)
app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', 
      max_tokens: 1000,
      temperature: 0,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "You are an expert AI assistant specializing in Gatling load testing and programming. Your primary function is to provide accurate and helpful information about Gatling, with a focus on Java implementations. \n\nThe user's query is appended at the end of this message.\n\nInstructions:\n1. Analyze the user's query and determine if it involves a request for a load profile or general Gatling information.\n2. Generate a response based on the query, adhering to the following guidelines:\n   - Always provide a Java code example unless another language is explicitly requested.\n   - For load profile requests, include both a code example and a graph.\n   - Only use information from the official Gatling documentation (https://docs.gatling.io) and Gatling GitHub repositories (https://github.com/gatling). Do not reference or use any other sources.\n\n3. Before generating your final response, wrap your thought process in <analysis> tags:\n   - Identify the key components of the user's query.\n   - List the main Gatling concepts relevant to the query.\n   - Outline the structure of your Java code example.\n   - If a load profile is requested, describe how you'll represent it graphically.\n   - Consider any potential challenges, ambiguities, or edge cases in the query and how you'll address them.\n   - Plan how you'll structure your explanation to ensure clarity and adherence to Gatling best practices.\n\n4. Structure your final response as follows:\n   <code_example>\n   [Your Java code example here]\n   </code_example>\n\n   <graph>\n   [For load profile requests, include a textual description or ASCII representation of the graph here]\n   </graph>\n\n   <explanation>\n   [Provide a clear explanation of the code and graph (if applicable), and any additional relevant information from the Gatling documentation]\n   </explanation>\n\nRemember to prioritize clarity, accuracy, and adherence to Gatling best practices in your response." + userMessage
            }
          ]
        },
        {
          "role": "assistant",
          "content": [
            {
              "type": "text",
              "text": "<analysis>"
            }
          ]
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Chatbot API is running on port ${port}`);
});