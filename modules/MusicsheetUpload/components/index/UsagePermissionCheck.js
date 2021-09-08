import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MP_WEB } from '../../utils/ImplementationModesLookup';
import useHasUserRoles from '@marschpat/local/utils/useHasUserRoles';
import Card from '@material-ui/core/Card';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

const UsagePermissionCheck = props => {
    const history = useHistory();
    const [hasUserSubscribedRole, hasUserJumpSeatRole, isAdmin] = useHasUserRoles(props.user, props.organisation);

    function isAllowedToUse() {
        if (props.implementationMode === MP_WEB) {
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
                    <Typography color="textSecondary">
                        Du kannst unseren Notenblatt Uploader leider nicht nützen.
                    </Typography>
                    <Typography>
                        Um unseren MARSCHPAT Notenblatt Uploader nützen zu können bitte eine MARSCHPAT Mitgliedschaft
                        abschließen, oder Administrator in deinem Verein werden.
                    </Typography>
                </CardContent>
            </Card>
        </Backdrop>
    );
};

export default UsagePermissionCheck;
