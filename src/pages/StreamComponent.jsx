import React, { useRef, useState } from 'react';
import { marked } from 'marked';
import { useNavigate } from 'react-router-dom';

const StreamComponent = () => {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const tempStore = useRef("")

    const navigate = useNavigate()

    const parseSSEData = (chunk) => {
        chunk.replace("\n", "");
        console.log('Chunk:', chunk);
        // Split chunk by newline to handle multiple JSON objects
        const dataLines = chunk.trim().split('\n').map(line => line.replace(/^data: /, ''));
        const finalOutput = dataLines.map(jsonData => {
            try {
                return JSON.parse(jsonData);
            } catch (e) {
                return null;
            }
        }).filter(parsed => parsed !== null);
        return finalOutput
    };

    const fetchData = async (e) => {

        e.preventDefault();
        setIsLoading(true);

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

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    
                    const parsedChunks = parseSSEData(chunk);
                    parsedChunks.forEach(parsedChunk => {
                        if (parsedChunk && parsedChunk.message) {
                            tempStore.current = tempStore.current + parsedChunk.message
                            setData(marked(tempStore.current))
                        }
                    });
                }
            }
        } 

        catch (err) {
            console.error("Failed to fetch stream", err);
        }

        finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            
            <form onSubmit={fetchData}>
                <button className='bg-green-600yy' type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Send'}
                </button>
            </form>

            <button onClick={ () => navigate("/")}>Go Home</button>

            <div className ='w-screen min-h-screen' dangerouslySetInnerHTML={{ __html: data }} />
        </div>
    );
};

export default StreamComponent;
