import React, { useState } from 'react';

const StreamComponent = () => {
    const [data, setData] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const parseSSEData = (chunk) => {
        // Split chunk by newline to handle multiple JSON objects
        const dataLines = chunk.trim().split('\n').map(line => line.replace(/^data: /, ''));
        return dataLines.map(jsonData => {
            try {
                return JSON.parse(jsonData);
            } catch (e) {
                console.error('JSON parse error:', e);
                console.error(jsonData)
                return null;
            }
        }).filter(parsed => parsed !== null);
    };

    const fetchData = async (e) => {

        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/bot/validator/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_idea : "A platform that writes novels from scratch using AI. The system uses deep learning to generate plotlines, character development, and dialogue without any human input. It claims to produce bestsellers in any genre by following popular trends in literature.",
                    user_target_market : "Aspiring authors, Publishers, Readers looking for AI-generated content"
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stream');
            }

            console.log(response)

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    console.log('Chunk:', chunk);

                    const parsedChunks = parseSSEData(chunk);
                    parsedChunks.forEach(parsedChunk => {
                        if (parsedChunk && parsedChunk.message) {
                            setData(prevData => prevData + parsedChunk.message);
                        }
                    });
                }
            }


        } 

        catch (err) {
            console.error(err);
            setError('Failed to fetch stream');
        }

        finally{
            setIsLoading(false);
        }
    };

    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        fetchData();
    };

    return (
        <div>
            <h1>Streaming Data</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <textarea
                value={data}
                readOnly
                rows={10}
                cols={50}
            />
            <form onSubmit={fetchData}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default StreamComponent;
