import React, { useState,useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {

  const navLinkStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? '600' : '400',
    };
  };
  const navigate = useNavigate();
  const handleClick = () => {

    navigate('/sign-in');

  }
  // const [isChatOpen, setIsChatOpen] = useState(false);
  // const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState('');

  // // Function to simulate an API call
  // const startChatSession = async () => {
  //   try {
  //     // Simulate an API call for chat session
  //     const response = await fetch('/api/start-chat'); // Replace with your actual API
  //     const data = await response.json();
      
  //     // If successful, you can update state or add a starting message
  //     setMessages([{ sender: 'system', text: 'Chat session started!' }]);
  //   } catch (error) {
  //     console.error('Error starting chat session:', error);
  //   }
  // };

  // // Function to send a message
  // const sendMessage = () => {
  //   if (message.trim()) {
  //     setMessages([...messages, { sender: 'user', text: message }]);
  //     setMessage('');
  //   }
  // };
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  // const chatboxRef = useRef(null);

  // Function to create a chat session and get the session token
  const createChatSession = async () => {
    try {
      // API call to create a chat session
      const response = await fetch('http://127.0.0.1:8000/create_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //   userId: 'your-user-id', // You can pass user-specific data here
        // }),
      });
     


      if (response.ok) {
        const data = await response.json();
         // Log the full response data to ensure it's correct
      console.log('Full API Response:', data);
        // if (data.session_id) {
        //   setSessionId(data.session_id); // Store session token
        //   console.log('Session Token Stored:', data.session_id);
        if (Array.isArray(data) && data[0]?.session_id) {
          setSessionId(data[0].session_id);  // Set sessionId state from index 0
          console.log('Session ID set:', data[0].session_id);  // Log the session ID for debugging
        } else {
          console.error('Session token not found in response.');
        }
  
        // setSessionToken(data.sessionToken); // Store session token
        setMessages([{ sender: 'system', text: 'Chat session started!' }]);
        console.log('Session Token:', data[0].session_id); // Log the session token
      } else {
        console.error('Failed to create chat session');
      }
    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  // Function to handle sending a message to the chatbot
  const sendMessage = async () => {
    console.log('sendMessage function triggered');  // Add this to check if the function is triggered
    console.log('Message:', message);  // Log the message content
console.log('Session Token:', sessionId);  // Log the session token to check if it's valid

    if (message.trim() && sessionId) {
      // Add user message to chat immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: message },
      ]);
  
      try {
        // API call to send chat message and get response
        const response = await fetch('http://127.0.0.1:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,           // Send the user's message
            sessionId: sessionId, // Use the session token from the first API call
          }),
        });
      
        
        console.log(response);  // Log the response object to check the status
        if (response.ok) {
          const data = await response.json();
          // console.log(data); 
          // console.log(Object.keys(data));  // List all the keys in the response
          // console.log('Bot Response:', data[0][0]); // Log the response
          setMessages((prevMessages) => [
            ...prevMessages,
            // { sender: 'user', text: message },
            { sender: 'bot', text: data[0][0] },
          ]);
          setMessage(''); // Clear input field
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  useEffect(() => {
    const chatContainer = document.querySelector('.overflow-y-auto');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  // Monitor the sessionToken and trigger sendMessage when it's available
  useEffect(() => {
    if (sessionId) {
      console.log('Session Token has been set:', sessionId); // Log the session token when it's updated
    }
  }, [sessionId]); // This hook will run whenever sessionToken changes
  const [isMobNav, setIsMobNav] = useState(false);
  const handleNav = () => {
    setIsMobNav(!isMobNav);
  }


  return (
    <div className='bg-[#FEFAE0] h-[80px] w-full fixed z-20'>
      <div className='flex max-w-7xl items-center justify-between m-auto h-full'>
        <div className='text-5xl'>HMS</div>
        <div className=' justify-center items-center gap-6 text-xl hidden md:flex'>
          <NavLink style={navLinkStyle} to="/">Home</NavLink>
          <NavLink style={navLinkStyle} to="/appointment">Appointment</NavLink>
          <NavLink style={navLinkStyle} to="/about-us">About Us</NavLink>
          <NavLink style={navLinkStyle} to="/contact-us">Contact Us</NavLink>
          {/* <button className='bg-slate-800 text-white p-1 pe-2 ps-2 rounded-full hover:scale-110 hover:bg-slate-800 duration-300 active:scale-90' onClick={handleClick}>HMS Chat</button> */}
          <button
            onClick={() => {
              setIsChatOpen(true);
              createChatSession();  // Start the chat session when button is clicked
            }}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md"
          >
            HMS Chat
          </button>
          {isChatOpen && (
        <div className="fixed bottom-5 right-5 w-96 h-[500px] bg-white shadow-lg rounded-lg border border-gray-300">
          <div className="flex flex-col h-full">
            {/* Close Button */}
      <button
        onClick={() => setIsChatOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
      >
        &times;
      </button>
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center p-2 border-t border-gray-300">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
          <button className='bg-slate-900 text-white p-1 pe-2 ps-2 rounded-full hover:scale-110 hover:bg-slate-800 duration-300 active:scale-90' onClick={handleClick}>Login</button>

        </div>
        <svg className={isMobNav ? 'size-10 md:hidden cursor-pointer z-50 text-white' : 'size-10 md:hidden cursor-pointer z-50'} onClick={handleNav} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
        <div className={!isMobNav ? 'hidden' : 'flex flex-col absolute top-0 left-0 h-screen w-screen text-white text-xl justify-center items-center bg-black md:hidden '}>
          <NavLink className="py-6 text-3xl" style={navLinkStyle} to="/">Home</NavLink>
          <NavLink className="py-6 text-3xl" style={navLinkStyle} to="/appointment">Appointment</NavLink>
          <NavLink className="py-6 text-3xl" style={navLinkStyle} to="/about-us">About Us</NavLink>
          <NavLink className="py-6 text-3xl" style={navLinkStyle} to="/contact-us">Contact Us</NavLink>
          <NavLink className="py-6 text-3xl" style={navLinkStyle} to="/sign-in">Sign In</NavLink>

        </div>

      </div>
    </div>
  )
}

export default Navbar;
// export default ChatComponent;