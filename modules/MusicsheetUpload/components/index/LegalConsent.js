import React from 'react';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const LegalConsent = ({agreed, handleChange}) => {
    return (
        <section className="mt-48">
            <Typography variant="h6" className="font-bold">Zustimmen</Typography>
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
                        <div className="max-w-2xl ml-12 text-base">
                            <span className={!agreed ? 'text-red-500' : ''}>
                                Hiermit bestätige ich explizit, dass ich die notwendigen Rechte der Musikstücke bzw. Einzelstimmen besitze und somit die Rechte Dritter nicht verletzt werden. MARSCHPAT weißt darauf hin, dass das Vervielfältigen und die Weitergabe von Musiknoten an Dritte urheberrechtlich verboten ist.
                            </span>
                        </div>
                    }
                />
                {!agreed && <div className="flex items-center text-base">
                    <Icon className="mr-4 text-red-500">report</Icon>
                    <span className="text-red-500">Bitte zustimmen!</span>
                </div>}
            </div>
        </section>
    );
}

export default LegalConsent;
