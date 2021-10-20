import React, { useContext } from 'react';
import InfoTooltip from '../InfoTooltip';
import VoicesAutoAssignButton from './VoicesAutoAssignButton';
import { MP_EDU } from '../../utils/ImplementationModesLookup';
import { UploaderContext } from '../../context/UploaderContext';
import InstrumentSheetsManipulationList from './InstrumentSheetsManipulationList';
import Typography from '@material-ui/core/Typography';

const InstrumentSheetsOverview = props => {
    const sheetsExist = props.instrumentSheets && props.instrumentSheets.length > 0;
    const { implementationMode } = useContext(UploaderContext);

    return (
        <section className="mt-40">
            <div className="flex items-center justify-between">
                <Typography variant="h6" className="font-bold">
                    Stimmen
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
                <InfoTooltip
                    name="instrument-voices-overview-info"
                    title="Hier siehst du alle Instrumentenstimmen des Musikstücks und kannst diese im Detail bearbeiten"
                />
            </div>
            <div className="pl-8">
                {sheetsExist ? (
                    <InstrumentSheetsManipulationList {...props} />
                ) : (
                    <Typography className="text-center text-gray-400 text-lg">
                        Stimmen zum Upload auswählen.
                    </Typography>
                )}
            </div>
        </section>
    );
};

export default InstrumentSheetsOverview;
