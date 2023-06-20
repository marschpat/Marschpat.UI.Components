import React, { useContext } from 'react';
import InfoTooltip from '../InfoTooltip';
import VoicesAutoAssignButton from './VoicesAutoAssignButton';
import { MP_EDU } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import { UploaderContext } from '../../context/UploaderContext';
import InstrumentSheetsManipulationList from './InstrumentSheetsManipulationList';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const InstrumentSheetsOverview = props => {
    const { t } = useTranslation(['uploader']);
    const sheetsExist = props.instrumentSheets && props.instrumentSheets.length > 0;
    const { implementationMode, inHelpMode } = useContext(UploaderContext);

    return (
        <section className="mt-40">
            <div className="flex items-center justify-between">
                <Typography variant="h6" className="font-bold">
                    {t('UPLOADER_VOICES')}
                </Typography>

                {implementationMode !== MP_EDU && sheetsExist && (
                    <VoicesAutoAssignButton
                        instrumentSheets={props.instrumentSheets}
                        availableVoices={props.availableVoices}
                        handleCastCheck={props.handleCastCheck}
                        handleAssignedVoicesChange={props.handleAssignedVoicesChange}
                        handleInstrumentSheetsUpdate={props.handleInstrumentSheetsUpdate}
                    />
                )}
                {inHelpMode && (
                    <InfoTooltip
                        name="instrument-voices-overview-info"
                        title={t('UPLOADER_VOICES_TTP')}
                    />
                )}
            </div>
            <div className="pl-8">
                {sheetsExist ? (
                    <InstrumentSheetsManipulationList {...props} />
                ) : (
                    <Typography className="text-center text-gray-400 text-lg">
                        {t('UPLOADER_VOICES_SELECT')}
                    </Typography>
                )}
            </div>
        </section>
    );
};

export default InstrumentSheetsOverview;
