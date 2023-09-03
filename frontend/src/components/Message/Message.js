import React from 'react';
import sanitizeHtml from 'sanitize-html';
import './Message.css';

/**
 * Example payload:
 * {
 * "message": "Hello World!",
 * "username": "John Doe",
 * "timestamp": "2021-04-20T20:00:00.000Z",
 * "incoming": false,
 * "animate": true
 * }
 * 
 * @param {string} message: message object
 * @returns 
 */
export default function Message({ message }) {
    // const date = new Date(message.timestamp);
    const [messageText, setMessageText] = React.useState("");
    const formattedDateTime = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(message.timestamp));

    React.useEffect(() => {
        if (message.animate) {
            async function animateMessage() {
                const sanitizedMessage = sanitizeHtml(message.message);
                // const textOnly = sanitizedMessage.replace(/<[^>]*>?/gm, '');
                // const messageParts = textOnly.split(' ');

                // const length = messageParts.length;
                // for (let i = 0; i < length; i++) {
                //     setMessageText(messageText => messageText + messageParts[i] + ' ');
                //     await new Promise(r => setTimeout(r, 150));
                // }
                message.animate = false;
                setMessageText(sanitizedMessage);
            }
            animateMessage();
        } else {
            setMessageText(message.message);
        }
    }, [message, message.animate, message.message]);

    return (
        <div className="message-container">
            <div className={`message__info ${message.incoming ? "incoming" : "outgoing"}`}>
                <span className='message__username'> {message.username}</span>
                <span className='message__text' dangerouslySetInnerHTML={{ __html: messageText }}></span>
                <span className="message__timestamp">
                    {formattedDateTime}
                </span>
            </div>
        </div>
    )
}
