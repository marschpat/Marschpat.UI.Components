import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

const PlaylistControls = ({ musicsheetId, inPlaylist }) => {
    return (
        <div className="mr-20">
            <Tooltip title={`Zum vorherigen Stück in Playlist ${inPlaylist.name}`}>
                <IconButton
                    onClick={() => {
                        console.log('in playlist', inPlaylist);
                    }}
                    edge="start"
                    color="inherit"
                    aria-label="previous musicsheet in playlist"
                >
                    <SkipPreviousIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={`Zum nächsten Stück in Playlist ${inPlaylist.name}`}>
                <IconButton
                    // onClick={() => setIsCarouselFullscreen(prev => !prev)}
                    edge="start"
                    color="inherit"
                    aria-label="next musicsheet in playlist"
                >
                    <SkipNextIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default PlaylistControls;
