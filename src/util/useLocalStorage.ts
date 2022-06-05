import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: string) {
    try {
        const saved = localStorage.getItem(key) || "";
        const initial = JSON.parse(saved);
        return initial || defaultValue;
    } catch (err) {
        return defaultValue
    }
}

export const useLocalStorage = (key: string, defaultValue: string) => {
    // https://blog.logrocket.com/using-localstorage-react-hooks/
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};