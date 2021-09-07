import { useState, useEffect } from 'react';

const useInDebugMode = () => {
    const [inDebug, setInDebug] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const debugParam = urlParams.get('debug');
        if (debugParam) {
            setInDebug(true);
        }
    }, []);

    return inDebug;
};

export default useInDebugMode;
