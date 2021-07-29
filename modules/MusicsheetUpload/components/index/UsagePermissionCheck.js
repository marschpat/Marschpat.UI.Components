import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import useHasUserRoles from '@marschpat/local/utils/useHasUserRoles';
import Card from '@material-ui/core/Card';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

const UsagePermissionCheck = props => {
    const history = useHistory();
    const user = useSelector(({ auth }) => auth.user);
    const organisation = useSelector(({ marschpat }) => marschpat.organisation);
    const [ hasUserSubscribedRole, hasUserJumpSeatRole, isAdmin ] = useHasUserRoles(user, organisation);

    function isAllowedToUse() {
        return hasUserSubscribedRole() || (hasUserJumpSeatRole() && isAdmin());
    }

    return isAllowedToUse() ? props.children : (
        <Backdrop
            open={true}
            onClick={ () => history.push('/pages/myprofile') }
        >
            <Card className="max-w-sm">
                <CardContent>
                    <Typography color="textSecondary">
                        Du kannst unseren Notenblatt Uploader leider nicht nützen.
                    </Typography>
                    <Typography>
                        Um unseren MARSCHPAT Notenblatt Uploader nützen zu können bitte eine MARSCHPAT Mitgliedschaft abschließen, oder Administrator in deinem Verein werden.
                    </Typography>
                </CardContent>
            </Card>
        </Backdrop>
    );
}

export default UsagePermissionCheck;
