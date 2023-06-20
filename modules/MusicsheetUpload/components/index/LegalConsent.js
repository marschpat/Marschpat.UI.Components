import React from 'react';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';

const LegalConsent = ({ agreed, handleChange }) => {
    const { t } = useTranslation(['uploader']);
    return (
        <section className="mt-60">
            <Typography variant="h6" className="font-bold">
                {t('UPLOADER_ACCEPT')}
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
                                    {t('UPLOADER_LEGAL_CONSENT')}
                                </p>
                            </div>
                        </div>
                    }
                />
                {!agreed && (
                    <div className="flex items-center text-base">
                        <Icon className="mr-4 text-red-500">report</Icon>
                        <span className="text-red-500">{t('UPLOADER_ACCEPT_NOTICE')}</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LegalConsent;
