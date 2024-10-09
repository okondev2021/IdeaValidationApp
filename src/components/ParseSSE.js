const parseSSEData = (chunk) => {
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

export default parseSSEData