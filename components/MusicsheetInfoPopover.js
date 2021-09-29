import React, { useEffect, useState } from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

function MusicsheetInfoPopover(props) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const infoRows = [
        { name: 'Titel', value: props.musicsheet?.name ?? null },
        { name: 'Komponist', value: props.musicsheet?.composerName ?? null },
        { name: 'Verlag', value: props.musicsheet?.publisher ?? null },
        { name: 'Arrangeur', value: props.musicsheet?.arrangeurName ?? null },
        { name: 'Besetzung', value: props.musicsheet?.castName ?? null },
        { name: 'Copyright', value: props.musicsheet?.copyright ?? null },
        { name: 'Untertitel', value: props.musicsheet?.subTitle ?? null },
    ];

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
                {infoRows.map((row, index) => row.value && <InfoRow name={row.name} value={row.value} key={index} />)}
            </div>
        </Popover>
    ) : (
        <></>
    );

    function InfoRow({ name, value }) {
        return (
            <div className="grid grid-cols-2 gap-4 border-b">
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
