import { useState } from 'react';

const useValidationErrors = () => {
    const [errors, setErrors] = useState([
        { attrName: 'title', msg: 'Bitte Titel eingeben' },
        { attrName: 'cast', msg: 'Bitte Besetzung auswählen!' }
    ]);

    // Validate required field errors
    const validateRequiredFields = data => {
        if (!data) return;

        setErrors(prev => {
            if (data.castId > 0) {
                prev = prev.filter(error => error.attrName !== 'cast');
            }
            if (data.title && data.title !== '') {
                prev = prev.filter(error => error.attrName !== 'title');
            }
            return prev;
        });
    };

    // Check if any given attribute has an validation error set
    const checkIfError = attrName => {
        if (!errors || errors.length < 1) {
            return false;
        }

        return errors.find(error => error.attrName === attrName) ?? false;
    };

    return [errors, checkIfError, validateRequiredFields];
};

export default useValidationErrors;
