import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const UploadScopeSelector = props => {
    const [uploadScope, setUploadScope] = useState('');
    const user = props.user;
    // const user = useSelector(({ auth }) => auth.user);
    const organisation = props.organisation;
    // const organisation = useSelector(({ marschpat }) => marschpat.organisation);
    const initialState = () => hasUserSubscribedRole() ? 'private' : 'organisation';
    const allowAdminActions = () => {
        return organisation && organisation.members.find(member => member.userID === user.userID && member.isAdmin)
	};

    // Set the initial uploadScope
    useEffect(() => {
        setUploadScope(initialState)
    }, [])

    useEffect(() => {
        if (props.initialScope) {
            setUploadScope(props.initialScope);
        }
    }, [props.initialScope]);

    // Handle uploadScope changes
    useEffect(() => {
        const apiUploadScopeMap = {
            'public': { ownerType: 0, ownerId: 0 },
            'organisation': { ownerType: 1, ownerId: organisation?.organisationId },
            'private': { ownerType: 2, ownerId: 0 },
        }
        props.handleUploadScopeUpdate(apiUploadScopeMap[uploadScope]);
    }, [uploadScope]);

    return (
        <section className="mt-20">
            <Typography variant="h6" className="font-bold">Zuordnung</Typography>
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
                            label={<Typography>In meinen privaten Notenpool hochladen.</Typography>}
                            className="-mb-12"
                        />
                    )}
                    {organisation && hasUserJumpSeatRole() && allowAdminActions() && (
                        <FormControlLabel
                            value="organisation"
                            control={<Radio />}
                            label={<Typography>{`In den Notenpool meines Vereins: ${organisation?.name} hochladen.`}</Typography>}
                        />
                    )}
                </RadioGroup>
            </FormControl>
        </section>
    );

    function hasUserSubscribedRole() {
		return user?.role.some(r => ['admin', 'staff', 'userSubscribed'].includes(r));
	}
	function hasUserJumpSeatRole() {
		return user?.role.some(r => ['admin', 'staff', 'userSubscribed', 'userJumpseat'].includes(r));
	}
}

export default UploadScopeSelector;
