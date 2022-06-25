import React from 'react';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const LegalConsent = ({ agreed, handleChange }) => {
    return (
        <section className="mt-60">
            <Typography variant="h6" className="font-bold">
                Zustimmen
            </Typography>
            <div className="flex items-center justify-between">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={agreed}
                            onChange={handleChange}
                            className={!agreed ? 'pl-24 text-red-500' : 'pl-24'}
                            color="secondary"
                            name="legal-consent"
                        />
                    }
                    label={
                        <div className="max-w-lg ml-12 text-base">
                            <div className="mt-10">
                                <p className={!agreed ? 'text-red-500' : ''}>
                                    Hiermit bestätige ich explizit, dass ich die notwendigen Rechte der Musikstücke bzw. Einzelstimmen besitze und somit die Rechte Dritter nicht verletzt werden. MARSCHPAT weißt darauf hin, dass das Vervielfältigen und die Weitergabe von Musiknoten an Dritte urheberrechtlich verboten ist. Die hochgeladenen Musikstücke stehen nur dem jeweiligen Verein/Einzeluser zur internen Verwendung zur Verfügung und werden von MARSCHPAT nicht öffentlich gestellt und auch nicht an Dritte weitergegeben."
                                </p>
                            </div>
                        </div>
                    }
                />
                {!agreed && (
                    <div className="flex items-center text-base">
                        <Icon className="mr-4 text-red-500">report</Icon>
                        <span className="text-red-500">Bitte zustimmen!</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LegalConsent;
