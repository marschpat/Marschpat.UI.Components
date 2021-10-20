import React, { useContext, useEffect, useState } from 'react';
import InfoTooltip from '../InfoTooltip';
import { UploaderContext } from '../../context/UploaderContext';
import useHasUserRoles from '@marschpat/local/utils/useHasUserRoles';
import { MP_WEB, MP_EDU } from '../../utils/ImplementationModesLookup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const labelTexts = {
    [MP_WEB]: {
        private: 'In meinen privaten Notenpool hochladen',
        org: 'In den Notenpool meines Vereins hochladen: ',
    },
    [MP_EDU]: {
        private: 'Für mich hochladen (privater Notenpool)',
        org: 'Für Musikschule Notenpool hochladen: ',
    },
};

const UploadScopeSelector = props => {
    const { implementationMode, user, organisation, inHelpMode } = useContext(UploaderContext);
    const [uploadScope, setUploadScope] = useState('');
    const [hasUserSubscribedRole, hasUserJumpSeatRole, isAdmin] = useHasUserRoles(
        user,
        organisation
    );
    const initialState = () => (hasUserSubscribedRole() ? 'private' : 'organisation');
    const allowAdminActions = () => {
        if (implementationMode === MP_EDU) {
            return organisation && (user.isAdmin || user.isTeacher);
        }

        return isAdmin();
    };

    // Set the initial uploadScope
    useEffect(() => {
        setUploadScope(initialState);
    }, []);

    useEffect(() => {
        if (props.initialScope) {
            setUploadScope(props.initialScope);
        }
    }, [props.initialScope]);

    // Handle uploadScope changes
    useEffect(() => {
        const apiUploadScopeMap = {
            public: { ownerType: 0, ownerId: 0 },
            organisation: {
                ownerType: 1,
                ownerId: organisation?.organisationId,
            },
            private: { ownerType: 2, ownerId: 0 },
        };
        props.handleUploadScopeUpdate(apiUploadScopeMap[uploadScope]);
    }, [uploadScope]);

    return (
        <section className="mt-40">
            <div className="flex items-center justify-between">
                <Typography variant="h6" className="font-bold">
                    Zuordnung
                </Typography>
                {inHelpMode && (
                    <InfoTooltip
                        name="assignement-info"
                        title='Lege fest ob das Musikstück nur für dich (in deinem privaten Notenpool - "MEINE NOTEN") oder für alle Mitglieder deines Vereins / deiner Musikschule ("GEMEINSAME NOTEN") zur Verfügung stehen soll.'
                    />
                )}
            </div>
            <FormControl component="fieldset" className="pl-24">
                <RadioGroup
                    value={uploadScope}
                    onChange={(e, value) => setUploadScope(value)}
                    name="uploadScope"
                    aria-label="upload-scope"
                    required
                >
                    {hasUserSubscribedRole() && (
                        <FormControlLabel
                            value="private"
                            control={<Radio />}
                            label={
                                <Typography>{labelTexts[implementationMode].private}</Typography>
                            }
                            className="-mb-12"
                        />
                    )}
                    {organisation && hasUserJumpSeatRole() && allowAdminActions() && (
                        <FormControlLabel
                            value="organisation"
                            control={<Radio />}
                            label={
                                <Typography>
                                    {labelTexts[implementationMode].org + organisation?.name}
                                </Typography>
                            }
                        />
                    )}
                </RadioGroup>
            </FormControl>
        </section>
    );
};

export default UploadScopeSelector;
