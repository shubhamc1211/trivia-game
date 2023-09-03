import React from 'react';
import './ChatBox.css';
import { Fab, IconButton } from '@mui/material';
import Message from 'components/Message';
import { Send } from '@mui/icons-material';
import { FiMinimize2 } from 'react-icons/fi';
import { FaMessage } from 'react-icons/fa6';
import APIs from 'utils/APIs';
import axios from 'axios';

function performScrollToBottom() {
    const chatBody = document.querySelector('.chatbox__body');
    if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

function listenForMessges({ teamId = "123", gameId = "123", onMessage = null }) {
    console.log("listenForMessges: " + teamId + " " + gameId);
    const socket = new WebSocket(`${APIs.API_CHAT}?teamId=${teamId}&gameId=${gameId}`);

    socket.onopen = () => {
        console.log("Connected to server");
    };

    socket.onclose = () => {
        console.log("Disconnected from server");
    };

    socket.onmessage = (event) => {
        if (onMessage) {
            onMessage(event.data);
        }
    };

    return socket;
}

export default function ChatBox({ teamId = "123", gameId = "123" }) {
    console.log("ChatBox: " + teamId + " " + gameId);
    const [open, setOpen] = React.useState(false);
    const [isNewMessage, setIsNewMessage] = React.useState(false);
    const [currentMessage, setCurrentMessage] = React.useState('');
    const [scrollToBottom, setScrollToBottom] = React.useState(true);
    const [socket, setSocket] = React.useState(null);
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        if (scrollToBottom) {
            performScrollToBottom();
            setScrollToBottom(false);
        }
    }, [scrollToBottom]);

    React.useEffect(() => {
        if (isNewMessage && open) {
            setIsNewMessage(false);
        }
    }, [isNewMessage, open]);

    const sendMessage = (message) => {
        const userId = localStorage.getItem('userId') ?? "123";
        const userName = localStorage.getItem('userName') ?? "Rahul";

        setMessages([...messages, {
            message: message,
            username: userName,
            timestamp: new Date().toISOString(),
            incoming: false
        }]);

        const socketMessage = {
            teamId: teamId,
            gameId: gameId,
            message: message,
            userName: userName,
            userId: userId,
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(socketMessage));
        }

        setCurrentMessage('');
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

    React.useEffect(() => {
        const userId = localStorage.getItem('userId') ?? "123";

        axios.post(APIs.API_GET_USER, {
            id: userId
        }).then((response) => {
            console.log("User Data", response.data);
            localStorage.setItem('userName', response.data.name ?? "Unknown");
        }).catch((error) => {
            localStorage.setItem('userName', "Unknown");
        });
    }, []);


    React.useEffect(() => {
        axios.get(`${APIs.API_GET_MESSAGES}?teamId=${teamId}&gameId=${gameId}`)
            .then((response) => {
                const currentUserId = localStorage.getItem('userId');
                const messages = response.data.map((message) => {
                    const messageObject = JSON.parse(message);
                    return {
                        message: messageObject.message,
                        username: messageObject.userName,
                        timestamp: messageObject.timestamp,
                        incoming: messageObject.userId !== currentUserId
                    };
                })
                setMessages(messages);
            }).catch((error) => {
                console.log(error);
            });


        const socket = listenForMessges({
            teamId: teamId,
            gameId: gameId,
            onMessage: (message) => {
                const messageObject = JSON.parse(message);
                console.log("Message: " + {
                    message: messageObject.message,
                    username: messageObject.userName,
                    timestamp: messageObject.timestamp,
                    incoming: true
                });
                setMessages(messages =>
                    [...messages, {
                        message: messageObject.message,
                        username: messageObject.userName,
                        timestamp: messageObject.timestamp,
                        incoming: true
                    }]);
                setIsNewMessage(true);
                setScrollToBottom(true);
            }
        });
        setSocket(socket);
    }, [gameId, teamId]);

    return (
        <div id='chatbox' className='chatbox'>
            {
                open ?
                    (
                        <div className='chatbox-container'>
                            <div className='chatbox__header'>
                                <h2>Team Chat</h2>
                                <IconButton
                                    className='chatbox__close'
                                    onClick={() => {
                                        setIsNewMessage(false);
                                        setOpen(!open);
                                    }}
                                >
                                    <FiMinimize2 size={32} />
                                </IconButton>
                            </div>
                            <div className='chatbox__body'>
                                {
                                    messages.map((message, index) => (
                                        <Message key={index} message={message} />
                                    ))
                                }
                            </div>
                            <div className='chatbox__footer'>
                                <input
                                    className='chatbox__input'
                                    placeholder='Type a message...'
                                    onKeyDown={onEnterButton}
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                />
                                <IconButton
                                    className='chatbox__send'
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
                            className='fab_chatbox__button'
                            size="large"
                            sx={
                                {
                                    position: 'fixed',
                                    bottom: 16,
                                    left: 16,
                                    color: isNewMessage ? 'orange' : '#fff',
                                }
                            }
                            color="primary"
                            aria-label="add"
                            onClick={() => {
                                setIsNewMessage(false);
                                setOpen(!open);
                            }}
                        >
                            <FaMessage size={22} />
                        </Fab>
                    )
            }
        </div>
    )
}
