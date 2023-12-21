import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import MusicsheetDisplay from './MusicsheetDisplay';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import i18next from 'i18next';
import en from '../musicSheetDisplay-i18n/en';
import de from '../musicSheetDisplay-i18n/de';
import { useTranslation } from 'react-i18next';
i18next.addResourceBundle('en', 'msd', en);
i18next.addResourceBundle('de', 'msd', de);

const useStyles = makeStyles(theme => ({
    printStyleInvisible: {
        ['@media print']: {
            display: 'none',
        },
    },
    printStyleVisible: {
        display: 'none',
        ['@media print']: {
            display: 'block',
        },
    },
}));

const MusicsheetDialog = () => {
    const history = useHistory();
    const { t } = useTranslation(['msd']);
    const classes = useStyles();
    const user = useSelector(({ auth }) => auth.user);
    const organisation = useSelector(({ marschpat }) => marschpat.organisation);
    const { musicsheetMetaData, implementationMode } = useContext(MusicsheetLoaderContext);
    const [isOpen, setIsOpen] = useState(!!musicsheetMetaData);

    return (
        <Dialog fullScreen open={isOpen} onClose={closeDialog} TransitionComponent={Transition}>
            <div className={classes.printStyleInvisible + ' p-20'}>
                <MusicsheetDisplay
                    user={user}
                    organisation={organisation}
                    handleClose={closeDialog}
                />
            </div>
            <div className={classes.printStyleVisible}>
                <div className={'flex flex-col'}>
                    <div className="h-64" />
                    <img
                        width="128"
                        src="APP_ICON_2020.png"
                        alt="logo"
                        class="text-center flex items-center object-center self-center justify-center"
                    />
                    <Typography
                        variant="h2"
                        className="text-red text-center flex items-center object-center self-center justify-center"
                    >
                        {t('MSD_PRINT_NOT_ALLOWED')}
                    </Typography>
                </div>
            </div>
        </Dialog>
    );

    function closeDialog() {
        if(history.action !== 'POP' && history.location.lastLocation !== "/login") {
            history.goBack();
            return;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const fromPlaylist = urlParams.get('pl');
        const goBackPath = fromPlaylist
            ? `/playlist/${fromPlaylist}`
            : apiRoutes[implementationMode].musiclibrary;
        history.push(goBackPath);
    }
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default MusicsheetDialog;
