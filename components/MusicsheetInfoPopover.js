import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import Popover from '@material-ui/core/Popover';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

function MusicsheetInfoPopover(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const id = open ? 'music-information' : null;

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
    if (props.musicsheet === undefined) {
        return <></>;
    }
    return (
        props.musicsheet && (
            <Popover
                id={id}
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
                <div className={classes.mainContent}>
                    <Table className="w-full min-w-full">
                        <TableBody>
                            <TableRow key={'title'}>
                                <TableCell key={'desc'} component="th" scope="row">
                                    <Typography className={classes.typographyDesc}>{'Titel'}</Typography>
                                </TableCell>
                                <TableCell key={'value'} component="th" scope="row">
                                    <Typography className={classes.typographyValue}>{props.musicsheet.name}</Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow key={'componist'}>
                                <TableCell key={'desc'} component="th" scope="row">
                                    <Typography className={classes.typographyDesc}>{'Komponist'}</Typography>
                                </TableCell>
                                <TableCell key={'value'} component="th" scope="row">
                                    <Typography className={classes.typographyValue}>
                                        {props.musicsheet.composerName}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow key={'publisher'}>
                                <TableCell key={'desc'} component="th" scope="row">
                                    <Typography className={classes.typographyDesc}>{'Verlag'}</Typography>
                                </TableCell>
                                <TableCell key={'value'} component="th" scope="row">
                                    <Typography className={classes.typographyValue}>
                                        {props.musicsheet.publisher}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow key={'arrangeur'}>
                                <TableCell key={'desc'} component="th" scope="row">
                                    <Typography className={classes.typographyDesc}>{'Arrangeur'}</Typography>
                                </TableCell>
                                <TableCell key={'value'} component="th" scope="row">
                                    <Typography className={classes.typographyValue}>
                                        {props.musicsheet.arrangeurName}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow key={'cast'}>
                                <TableCell key={'desc'} component="th" scope="row">
                                    <Typography className={classes.typographyDesc}>{'Besetzung'}</Typography>
                                </TableCell>
                                <TableCell key={'value'} component="th" scope="row">
                                    <Typography className={classes.typographyValue}>
                                        {props.musicsheet.castName}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow key={'copyright'}>
                                <TableCell key={'desc'} component="th" scope="row">
                                    <Typography className={classes.typographyDesc}>{'Copyright'}</Typography>
                                </TableCell>
                                <TableCell key={'value'} component="th" scope="row">
                                    <Typography className={classes.typographyValue}>
                                        {props.musicsheet.copyright}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Popover>
        )
    );
}

const useStyles = makeStyles(theme => ({
    mainContent: {
        padding: theme.spacing(2),
    },
    typographyDesc: {
        fontSize: 14,
        fontWeight: 700,
    },
    typographyValue: {
        fontSize: 12,
    },
}));

export default MusicsheetInfoPopover;
