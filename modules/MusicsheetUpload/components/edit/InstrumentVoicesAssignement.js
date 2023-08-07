import React, { useContext } from 'react';
import { UploaderContext } from '../../context/UploaderContext';
import InstrumentVoicesSelector from './InstrumentVoicesSelector';
import InstrumentVoiceBuilder from './InstrumentVoiceBuilder';
import { MP_EDU, MP_WEB } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const InstrumentVoicesAssignement = props => {
    const { t } = useTranslation(['uploader']);
    const { implementationMode } = useContext(UploaderContext);

    return (
        <div className="w-full">
            <Typography variant="h5">
                {implementationMode === MP_EDU
                    ? t('UPLOADER_INST_AND_VOICE_LBL')
                    : t('UPLOADER_SET_VOICE_1')}
            </Typography>

            {implementationMode === MP_WEB && (
                <InstrumentVoicesSelector
                    assignedVoices={props.assignedVoices}
                    handleVoicesAssignemnt={props.handleVoicesAssignemnt}
                />
            )}

            {implementationMode === MP_EDU && (
                <InstrumentVoiceBuilder
                    assignedVoices={props.assignedVoices}
                    handleVoicesAssignemnt={props.handleVoicesAssignemnt}
                />
            )}
        </div>
    );
};

export default InstrumentVoicesAssignement;
