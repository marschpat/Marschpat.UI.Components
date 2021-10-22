import { useState } from 'react';
import { MP_EDU, MP_WEB } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

const useValidationErrors = (implementationMode = MP_WEB) => {
    const initialerrors = getInitialValidationErrors();
    const [errors, setErrors] = useState(initialerrors);

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

    function getInitialValidationErrors() {
        if (implementationMode === MP_WEB) {
            return [
                { attrName: 'title', msg: 'Bitte Titel eingeben' },
                { attrName: 'cast', msg: 'Bitte Besetzung auswählen!' },
            ];
        }
        if (implementationMode === MP_EDU) {
            return [{ attrName: 'title', msg: 'Bitte Titel eingeben' }];
        }
    }

    return [errors, checkIfError, validateRequiredFields];
};

export default useValidationErrors;
