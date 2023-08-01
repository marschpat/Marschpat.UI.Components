import React, { useContext } from 'react';
import LayerNameInput from './LayerNameInput';
import { MusicsheetDisplayContext } from '../../context/MusicsheetDisplayContexts';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const CreateLayerControls = props => {
    const { t } = useTranslation(['msd']);
    const { toggleViewMode } = useContext(MusicsheetDisplayContext);

    return (
        <div className="md:flex md:items-center">
            <div className="flex">
                <Button onClick={props.handlePersistLayer} variant="contained">
                    {t('MSD_NOTES_CREATE')}
                </Button>
                <Button
                    onClick={toggleViewMode}
                    className="mt-4 ml-4 md:mt-0 md:ml-12"
                    variant="contained"
                >
                    {t('MSD_NOTES_CREATE_CANCEL')}
                </Button>
            </div>

            <LayerNameInput handleLayerNameChange={props.handleLayerNameChange} />
        </div>
    );
};

export default CreateLayerControls;
