import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PlaylistControls = ({ musicsheetId, inPlaylist }) => {
    const { t } = useTranslation(['msd']);
    const [currentIndex, setCurrentIndex] = useState('');
    const [navLinks, setNavLinks] = useState({
        next: { available: false, path: '' },
        prev: { available: false, path: '' },
    });

    useEffect(() => {
        const [current, navLinks] = getMusicsheetNavigation();
        setCurrentIndex(current);
        setNavLinks(navLinks);
    }, [musicsheetId, inPlaylist]);

    function getMusicsheetNavigation() {
        const current = inPlaylist.musicSheets.find(el => el.sheetId === musicsheetId)?.index;

        const nextId =
            inPlaylist.musicSheets.find(el => el.index === current + 1)?.sheetId ?? false;
        const prevId =
            inPlaylist.musicSheets.find(el => el.index === current - 1)?.sheetId ?? false;

        const navLinks = {
            next: {
                available: !!nextId,
                path: nextId ? `/musicsheet/show/${nextId}?pl=${inPlaylist.playlistId}` : '',
            },
            prev: {
                available: !!prevId,
                path: prevId ? `/musicsheet/show/${prevId}?pl=${inPlaylist.playlistId}` : '',
            },
        };

        return [current, navLinks];
    }

    return (
        <div className="mr-20 flex items-cener">
            <Tooltip title={`${t('MSD_PREV_TRACK')} ${inPlaylist.name}`}>
                <IconButton
                    component={Link}
                    to={navLinks.prev.path}
                    color="inherit"
                    aria-label="previous musicsheet in playlist"
                    disabled={!navLinks.prev.available}
                >
                    <SkipPreviousIcon />
                </IconButton>
            </Tooltip>
            <Tooltip
                title={`${t('MSD_MUSICSHEET')} ${currentIndex} ${t('MSD_FROM')} ${
                    inPlaylist.count
                } ${t('MSD_FROM')} ${inPlaylist.name}`}
                className="cursor-default"
            >
                <div className="flex items-center">
                    <div className="text-xs text-center">
                        <div>{t('MSD_PIECE')}</div>
                        <div>
                            {currentIndex} / {inPlaylist.count}
                        </div>
                    </div>
                </div>
            </Tooltip>
            <Tooltip title={`${t('MSD_NEXT_TRACK')} ${inPlaylist.name}`}>
                <IconButton
                    component={Link}
                    to={navLinks.next.path}
                    color="inherit"
                    aria-label="next musicsheet in playlist"
                    disabled={!navLinks.next.available}
                >
                    <SkipNextIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default PlaylistControls;
