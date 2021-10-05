import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { Link } from 'react-router-dom';

const PlaylistControls = ({ musicsheetId, inPlaylist }) => {
    const [currentIndex, setCurrentIndex] = useState('');
    const [navLinks, setNavLinks] = useState({ prev: '', next: '' });

    useEffect(() => {
        const [current, nextSheetId, prevSheetId] = getMusicsheetNavigation();
        setCurrentIndex(current);
        setNavLinks({
            prev: `/musicsheet/show/${nextSheetId}?pl=${inPlaylist.playlistID}`,
            next: `/musicsheet/show/${prevSheetId}?pl=${inPlaylist.playlistID}`,
        });
    }, [musicsheetId, inPlaylist]);

    console.log('my nav links', navLinks);

    function getMusicsheetNavigation() {
        const current = inPlaylist.musicSheets.find(el => el.sheetID === musicsheetId)?.index;

        const next = inPlaylist.musicSheets.find(el => el.index === current + 1)?.sheetID ?? '';
        const prev = inPlaylist.musicSheets.find(el => el.index === current - 1)?.sheetID ?? '';

        return [current, next, prev];
    }

    return (
        <div className="mr-20 flex items-cener">
            <Tooltip title={`Zum vorherigen Stück in Playlist: ${inPlaylist.name}`}>
                <IconButton
                    component={Link}
                    to={navLinks.prev}
                    color="inherit"
                    aria-label="previous musicsheet in playlist"
                >
                    <SkipPreviousIcon />
                </IconButton>
            </Tooltip>
            <Tooltip
                title={`Musikstück ${currentIndex} von ${inPlaylist.count} in Playlist: ${inPlaylist.name}`}
                className="cursor-default"
            >
                <div className="flex items-center">
                    <div className="text-xs text-center">
                        <div>Stück</div>
                        <div>
                            {currentIndex} / {inPlaylist.count}
                        </div>
                    </div>
                </div>
            </Tooltip>
            <Tooltip title={`Zum nächsten Stück in Playlist: ${inPlaylist.name}`}>
                <IconButton
                    component={Link}
                    to={navLinks.next}
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
