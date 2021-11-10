import React, { useContext } from 'react';
import InfoTooltip from '../InfoTooltip';
import { UploaderContext } from '../../context/UploaderContext';

function BrowserSupportNote(props) {
    const { inHelpMode } = useContext(UploaderContext);

    return (
        inHelpMode && (
            <div className="flex items-center">
                <p className="mr-10 text-base text-orange-300 font-bold">Welcher Browser?</p>
                <InfoTooltip
                    name="browser-info"
                    title="Zum erstellen und bearbeiten von Musikstücken empfehlen wir ausschließlich folgende Browser in der AKTUELLSTEN Version: Google Chrome, Mozilla Firefox, Microsoft Edge. Andere Browser können zu unerwarteten Problemen führen und werden nicht unterstützt."
                />
            </div>
        )
    );
}

export default BrowserSupportNote;
