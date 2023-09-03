import React from 'react';
import './Timer.css';

export default function Timer({ endTime }) {
    const [days, setDays] = React.useState(0);
    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(0);

    const getTime = () => {
        const time = Date.parse(endTime) - Date.now();

        setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
    };

    React.useEffect(() => {
        const interval = setInterval(() => getTime(endTime), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {
                endTime === null ? `Starting...` :
                    days > 0 ? `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds` :
                        hours > 0 ? `${hours} hours ${minutes} minutes ${seconds} seconds` :
                            minutes > 0 ? `${minutes} minutes ${seconds} seconds` :
                                seconds > 0 ? `${seconds} seconds` :
                                    `Time's up!`
            }
        </div>
    )
}
