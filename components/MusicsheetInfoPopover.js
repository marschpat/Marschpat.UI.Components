import React, { useState } from 'react';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import i18next from 'i18next';
import en from './components-i18n/en';
import de from './components-i18n/de';
import { useTranslation } from 'react-i18next';
i18next.addResourceBundle('en', 'msd', en);
i18next.addResourceBundle('de', 'msd', de);

function MusicsheetInfoPopover(props) {
    const { t } = useTranslation(['msd']);
    const [anchorEl, setAnchorEl] = useState(null);
    const infoRows = [
        { name: t('COMP_POPOVER_TITLE'), value: props.musicsheet?.name ?? null },
        { name: t('COMP_POPOVER_SUBTITLE'), value: props.musicsheet?.subtitle ?? null },
        { name: t('COMP_POPOVER_COMPOSER'), value: props.musicsheet?.composerName ?? null },
        { name: t('COMP_POPOVER_PUBLISHER'), value: props.musicsheet?.publisher ?? null },
        { name: t('COMP_POPOVER_ARRANGEUR'), value: props.musicsheet?.arrangeurName ?? null },
        { name: t('COMP_POPOVER_CAST'), value: props.musicsheet?.castName ?? null },
        { name: t('COMP_POPOVER_ISWC_NR'), value: props.musicsheet?.iswc ?? null },
        { name: t('COMP_POPOVER_COPYRIGHT'), value: props.musicsheet?.copyright ?? null },
    ];
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return props.musicsheet ? (
        <div className={props.className ?? ''}>
            <Tooltip title={t('COMP_POPOVER_TTP')}>
                <IconButton
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
                <div className="px-20 py-10">
                    <div className="-mx-6 bg-gray-200">
                        <div className="px-6 py-6 mb-20 text-left text-xl font-medium text-gray-700 uppercase tracking-wider">
                            {t('COMP_POPOVER_HEADER')}
                        </div>
                    </div>
                    {infoRows.map(
                        (row, index) =>
                            row.value && <InfoRow name={row.name} value={row.value} key={index} />
                    )}
                </div>
            </Popover>
        </div>
    ) : (
        <></>
    );

    function InfoRow({ name, value }) {
        return (
            <div className="mb-10 grid grid-cols-2 gap-4 border-b">
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
