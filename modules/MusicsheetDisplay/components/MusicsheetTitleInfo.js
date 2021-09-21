import React, { useContext, useState } from 'react';
import MusicsheetPopoverInfo from './MusicsheetPopoverInfo';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const MusicsheetTitleInfo = () => {
    const { musicsheetMetaData } = useContext(MusicsheetLoaderContext);
    const [showPopover, setShowPopover] = useState(false);

    return (
        <div className="flex items-center">
            <Typography variant="h6" noWrap>
                Stück: {musicsheetMetaData.name}
            </Typography>

            <Tooltip title="Musikstück informationen" className="ml-20">
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="information"
                    aria-describedby={'music-information'}
                    onClick={e => setShowPopover(e.currentTarget)}
                >
                    <Icon>info</Icon>
                </IconButton>
            </Tooltip>

            <MusicsheetPopoverInfo
                musicsheet={musicsheetMetaData}
                target={showPopover}
                handlePopoverReset={() => setShowPopover(false)}
            />
        </div>
    );
};

export default MusicsheetTitleInfo;
