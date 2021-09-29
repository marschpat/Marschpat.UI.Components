import React, { useEffect, useState } from 'react';
import Popover from '@material-ui/core/Popover';
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
            <div className="p-20">
                <InfoRow name="Titel" value={props.musicsheet.name} />
                <InfoRow name="Komponist" value={props.musicsheet.composerName} />
                <InfoRow name="Verlag" value={props.musicsheet.publisher} />
                <InfoRow name="Arrangeur" value={props.musicsheet.arrangeurName} />
                <InfoRow name="Besetzung" value={props.musicsheet.castName} />
                <InfoRow name="Copyright" value={props.musicsheet.copyright} />
                <InfoRow name="Untertitel" value={props.musicsheet.subTitle} />
            </div>
        </Popover>
    ) : (
        <></>
    );

    function InfoRow({ name, value }) {
        return (
            <div className="grid grid-cols-2 gap-4 border-b" key={name + Math.random()}>
                <div>
                    <Typography className="text-lg font-semibold">{name}</Typography>
                </div>
                <div>
                    <Typography className="text-lg">{value}</Typography>
                </div>
            </div>
        );
    }
}

export default MusicsheetInfoPopover;
