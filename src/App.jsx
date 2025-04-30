import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatBranko!",
      sender: "ChatBranko",
      direction:"incoming"
    }
  ])

  const sendMessage = async (message) => {
    const newRequestMessage = {
      message: message,
      sender: "user",
      direction:"outgoing"
    }    
    setMessages((prevMessages) => [...prevMessages, newRequestMessage]);
    setTyping(true)
    await processMessage(newRequestMessage)
}

const mapMessageToApiFormat = (message) => {
  return {
    content: message.message,
    role: message.sender === "ChatBranko" ? "assistant" : "user" 
  };
};


async function processMessage(message){
  let apiMessage = mapMessageToApiFormat(message);
  
  const systemMessage = {
    role: "system",
    content: "Explain all concepts in advanced level of speaking."
  }

  const apiRequestBody = {
    "model": "gpt-3.5-turbo",
    "messages": [systemMessage,
      apiMessage] 
  }

  await fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers:{
        "Authorization": "Bearer "  + API_KEY,
        "Content-Type": "application/json"
      },
      body:JSON.stringify(apiRequestBody)
  }).then((data) => { 
    return data.json();
  }).then((data) => {
    //Test in console!
    console.log(data.choices[0].message.content);
    setMessages((prevMessages) => [...prevMessages,{
      message: data.choices[0].message.content,
    sender: "ChatBranko",
    direction:"incoming"
    }]);
    setTyping(false)
  });
}

  return (
      <div className='App'>
        <div style={{height:"85vh" , width: "750px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..."/> : null}>
            {
              messages.map((message, index) => {
                return <Message key={index} model={message}></Message>
              })
            }
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={(message) => sendMessage(message)}></MessageInput>
          </ChatContainer>
        </MainContainer>
        </div>
      </div>
  )
}

export default App
