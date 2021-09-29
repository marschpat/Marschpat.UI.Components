import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import Popover from '@material-ui/core/Popover';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

function MusicsheetInfoPopover(props) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (props.target) {
            setOpen(true);
            setAnchorEl(props.target);
        }
    }, [props.target]);

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
        props.handlePopoverReset();
    };

    return props.musicsheet ? (
        <Popover
            id="music-information"
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Table className="w-full min-w-full">
                <TableBody>
                    <InfoRow name="Titel" value={props.musicsheet.name} />
                    <InfoRow name="Komponist" value={props.musicsheet.composerName} />
                    <InfoRow name="Verlag" value={props.musicsheet.publisher} />
                    <InfoRow name="Arrangeur" value={props.musicsheet.arrangeurName} />
                    <InfoRow name="Besetzung" value={props.musicsheet.castName} />
                    <InfoRow name="Copyright" value={props.musicsheet.copyright} />
                    <InfoRow name="Untertitel" value={props.musicsheet.subTitle} />
                </TableBody>
            </Table>
        </Popover>
    ) : (
        <></>
    );

    function InfoRow({ name, value }) {
        return (
            <TableRow key={name + Math.random()}>
                <TableCell component="th" scope="row">
                    <Typography>{name}</Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography>{value}</Typography>
                </TableCell>
            </TableRow>
        );
    }
}

// const useStyles = makeStyles(theme => ({
//     mainContent: {
//         padding: theme.spacing(2),
//     },
//     typographyDesc: {
//         fontSize: 14,
//         fontWeight: 700,
//     },
//     typographyValue: {
//         fontSize: 12,
//     },
// }));

export default MusicsheetInfoPopover;
