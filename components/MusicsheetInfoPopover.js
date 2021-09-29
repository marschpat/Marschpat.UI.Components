import React, { useState } from 'react';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

function MusicsheetInfoPopover(props) {
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
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return props.musicsheet ? (
        <div className={props.className ?? ''}>
            <Tooltip title="Infos zu dem Stück">
                <IconButton
                    edge="start"
                    color={props.btnColor ?? 'default'}
                    aria-label="information"
                    aria-describedby={'music-information'}
                    onClick={handleClick}
                >
                    <Icon>info</Icon>
                </IconButton>
            </Tooltip>
            <Popover
                id="music-information"
                open={!!anchorEl}
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
                    {infoRows.map(
                        (row, index) => row.value && <InfoRow name={row.name} value={row.value} key={index} />
                    )}
                </div>
            </Popover>
        </div>
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
