import React from 'react';
import './ChatBot.css';
import { BsRobot } from 'react-icons/bs';
import { Fab, IconButton } from '@mui/material';
import Message from 'components/Message';
import { Send } from '@mui/icons-material';
import { FiMinimize2 } from 'react-icons/fi';
import axios from 'axios';
import APIs from 'utils/APIs';

function performScrollToBottom() {
    const chatBody = document.querySelector('.chatbot__body');
    if (chatBody) {
        // smooth scroll
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: 'smooth'
        });
    }
}

export default function ChatBot() {
    const [open, setOpen] = React.useState(false);
    const [messages, setMessages] = React.useState(JSON.parse(localStorage.getItem('messages')) ?? []);
    const [currentMessage, setCurrentMessage] = React.useState('');
    const [scrollToBottom, setScrollToBottom] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            performScrollToBottom();
        }, 1000);
    }, []);

    React.useEffect(() => {
        if (scrollToBottom) {
            performScrollToBottom();
            setScrollToBottom(false);
        }
    }, [scrollToBottom]);

    // storing last 10 messages to localStorage
    React.useEffect(() => {
        const lastMessages = [];

        const length = Math.min(messages.length, 10);

        for (let i = 0; i < length; i++) {
            const message = messages[messages.length - length + i];
            const copyObject = Object.assign({}, message);
            copyObject.animate = false;
            lastMessages.push(copyObject);
        }

        localStorage.setItem('messages', JSON.stringify(lastMessages));
    }, [messages]);


    const sendMessage = async (message) => {
        const userId = localStorage.getItem('userId') ?? "1234567890";

        const userMessage = {
            message: message,
            username: "User",
            timestamp: new Date().toISOString(),
            incoming: false
        };

        setMessages([...messages, userMessage]);
        setScrollToBottom(true);

        setCurrentMessage('');

        var botMessage = {};
        try {
            const lexResponse = await axios.post(APIs.API_LEX, {
                message: message,
                userId: userId
            });

            botMessage = {
                message: lexResponse.data,
                username: 'Bot',
                timestamp: new Date().toISOString(),
                incoming: true,
                animate: true
            };
        } catch (err) {
            botMessage = {
                message: 'Sorry, I am not available right now. Please try again later.',
                username: 'Bot',
                timestamp: new Date().toISOString(),
                incoming: true,
                animate: true
            };
        }

        setMessages([...messages, userMessage, botMessage]);
        setScrollToBottom(true);
    }

    const onEnterButton = (e) => {
        if (e.key === 'Enter') {
            onSendButton.call(e);
        }
    }

    const onSendButton = (e) => {
        if (currentMessage === '') return;
        sendMessage(currentMessage);
    }

    return (
        <div id='chatbot' className='chatbot'>
            {
                open ?
                    (
                        <div className='chatbot-container'>
                            <div className='chatbot__header'>
                                <h2>ChatBot</h2>
                                <IconButton
                                    className='chatbot__close'
                                    onClick={() => setOpen(!open)}
                                >
                                    <FiMinimize2 size={32} />
                                </IconButton>
                            </div>
                            <div className='chatbot__body'>
                                {
                                    messages.map((message, index) => (
                                        <Message key={index} message={message} />
                                    ))
                                }
                            </div>
                            <div className='chatbot__footer'>
                                <input
                                    className='chatbot__input'
                                    placeholder='Type a message...'
                                    onKeyDown={onEnterButton}
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                />
                                <IconButton
                                    className='chatbot__send'
                                    sx={{
                                        backgroundColor: '#3676cb'
                                    }}
                                    onClick={onSendButton}
                                >
                                    <Send size={32} sx={{
                                        color: 'white'
                                    }} />
                                </IconButton>
                            </div>
                        </div>
                    ) :
                    (
                        <Fab
                            className='fab_chatbot__button'
                            size="large"
                            sx={
                                {
                                    position: 'fixed',
                                    bottom: 16,
                                    right: 16,
                                }
                            }
                            color="primary"
                            aria-label="add"
                            onClick={() => setOpen(!open)}
                        >
                            <BsRobot size={28} />
                        </Fab>
                    )
            }
        </div>
    )
}
