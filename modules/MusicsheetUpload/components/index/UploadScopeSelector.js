import React, { useContext, useEffect, useState } from 'react';
import InfoTooltip from '../InfoTooltip';
import { UploaderContext } from '../../context/UploaderContext';
import useHasUserRoles from '@marschpat/local/utils/useHasUserRoles';
import { MP_WEB, MP_EDU } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';

const UploadScopeSelector = props => {
    const { t } = useTranslation(['uploader']);
    const labelTexts = {
        [MP_WEB]: {
            private: t('SCOPE_MARCH_PRIVATE'),
            org: t('SCOPE_MARCH_ORG') + ' ',
        },
        [MP_EDU]: {
            private: t('SCOPE_EDU_PRIVATE'),
            org: t('SCOPE_EDU_ORG') + ' ',
        },
    };
    const { implementationMode, user, organisation, inHelpMode } = useContext(UploaderContext);
    const [uploadScope, setUploadScope] = useState('');
    const [
        hasUserSubscribedRole,
        hasUserJumpSeatRole,
        hasUserJumpSeatRoleOnly,
        isAdmin,
        hasUserTrialExpired,
    ] = useHasUserRoles(user, organisation);
    const initialState = () =>
        hasUserSubscribedRole() && user.contextId === 0 ? 'private' : 'organisation';
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
                    {t('ASSIGNMENT')}
                </Typography>
                {inHelpMode && <InfoTooltip name="assignement-info" title={t('ASSIGNMENT_TEXT')} />}
            </div>
            <FormControl component="fieldset" className="pl-24">
                <RadioGroup
                    value={uploadScope}
                    onChange={(e, value) => setUploadScope(value)}
                    name="uploadScope"
                    aria-label="upload-scope"
                    required
                >
                    {hasUserSubscribedRole() && user.contextId === 0 && (
                        <FormControlLabel
                            value="private"
                            control={<Radio />}
                            label={
                                <Typography>{labelTexts[implementationMode].private}</Typography>
                            }
                            className="-mb-12"
                        />
                    )}
                    {organisation &&
                        hasUserJumpSeatRole() &&
                        allowAdminActions() &&
                        user.contextId === 1 && (
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
