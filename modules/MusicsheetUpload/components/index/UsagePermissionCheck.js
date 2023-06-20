import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UploaderContext } from '../../context/UploaderContext';
import useHasUserRoles from '@marschpat/local/utils/useHasUserRoles';
import { MP_WEB } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import Card from '@material-ui/core/Card';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { useTranslation } from 'react-i18next';

const UsagePermissionCheck = props => {
    const { t } = useTranslation(['uploader']);
    const { implementationMode, user, organisation } = useContext(UploaderContext);
    const history = useHistory();
    const [
        hasUserSubscribedRole,
        hasUserJumpSeatRole,
        hasUserJumpSeatRoleOnly,
        isAdmin,
        hasUserTrialExpired,
    ] = useHasUserRoles(user, organisation);

    function isAllowedToUse() {
        if (implementationMode === MP_WEB) {
            return hasUserSubscribedRole() || (hasUserJumpSeatRole() && isAdmin());
        }

        return true;
    }

    return isAllowedToUse() ? (
        props.children
    ) : (
        <Backdrop open={true} onClick={() => history.push('/pages/myprofile')}>
            <Card className="max-w-sm">
                <CardContent>
                    <Typography color="textSecondary">{t('UPLOADER_PERMISSION_MSG')}</Typography>
                    <Typography>{t('UPLOADER_PERMISSION_MSG_DESC')}</Typography>
                </CardContent>
            </Card>
        </Backdrop>
    );
};

export default UsagePermissionCheck;
