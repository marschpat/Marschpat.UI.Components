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
    const showInfoAttributes = {
        name: 'Titel',
        composerName: 'Komponist',
        publisher: 'Verlag',
        arrangeurName: 'Arrangeur',
        castName: 'Besetzung',
        copyright: 'Copyright',
        subTitle: 'Untertitel',
    };

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
                    <InfoRow name="title" value={props.musicsheet.name} key="1" />
                    {/* <TableRow key={'title'}>
                        <TableCell key={'desc'} component="th" scope="row">
                            <Typography>{'Titel'}</Typography>
                        </TableCell>
                        <TableCell key={'value'} component="th" scope="row">
                            <Typography>{props.musicsheet.name}</Typography>
                        </TableCell>
                    </TableRow> */}

                    <TableRow key={'componist'}>
                        <TableCell key={'desc'} component="th" scope="row">
                            <Typography>{'Komponist'}</Typography>
                        </TableCell>
                        <TableCell key={'value'} component="th" scope="row">
                            <Typography>{props.musicsheet.composerName}</Typography>
                        </TableCell>
                    </TableRow>

                    <TableRow key={'publisher'}>
                        <TableCell key={'desc'} component="th" scope="row">
                            <Typography>{'Verlag'}</Typography>
                        </TableCell>
                        <TableCell key={'value'} component="th" scope="row">
                            <Typography>{props.musicsheet.publisher}</Typography>
                        </TableCell>
                    </TableRow>

                    <TableRow key={'arrangeur'}>
                        <TableCell key={'desc'} component="th" scope="row">
                            <Typography>{'Arrangeur'}</Typography>
                        </TableCell>
                        <TableCell key={'value'} component="th" scope="row">
                            <Typography>{props.musicsheet.arrangeurName}</Typography>
                        </TableCell>
                    </TableRow>

                    <TableRow key={'cast'}>
                        <TableCell key={'desc'} component="th" scope="row">
                            <Typography>{'Besetzung'}</Typography>
                        </TableCell>
                        <TableCell key={'value'} component="th" scope="row">
                            <Typography>{props.musicsheet.castName}</Typography>
                        </TableCell>
                    </TableRow>

                    <TableRow key={'copyright'}>
                        <TableCell key={'desc'} component="th" scope="row">
                            <Typography>{'Copyright'}</Typography>
                        </TableCell>
                        <TableCell key={'value'} component="th" scope="row">
                            <Typography>{props.musicsheet.copyright}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Popover>
    ) : (
        <></>
    );

    function InfoRow({ name, value, key }) {
        return (
            <TableRow key={key}>
                <TableCell component="th" scope="row">
                    <Typography>{'Titel'}</Typography>
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
