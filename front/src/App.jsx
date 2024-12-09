import { useState } from 'react'
import React from 'react';
import ChatbotInterface from './ChatbotInterface';
import './index.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ChatbotInterface />
    </div>
    </>
  )
}

export default App


