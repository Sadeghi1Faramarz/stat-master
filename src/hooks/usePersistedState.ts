
'use client';

import { useState, useEffect } from 'react';

function tryParse(value: string) {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

export function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(defaultValue);

    // Read from localStorage on mount (client-side only)
    useEffect(() => {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            setState(tryParse(storedValue));
        }
    }, [key]);

    // Write to localStorage whenever state changes
    useEffect(() => {
        if (state === defaultValue) {
            // Avoids storing default value if it hasn't changed.
            // You might want to remove this if you want to store the default explicitly.
            return;
        }
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state, defaultValue]);

    return [state, setState];
}
