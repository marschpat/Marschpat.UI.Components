import React from 'react';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';

const MxlInfo = props => {
    return (
        <div className="mr-20">
            <div className="px-8 py-12 border border-mp-gold rounded-md">
                <div className="flex items-center">
                    <EmojiObjectsOutlinedIcon className="mr-6 text-mp-gold" fontSize="large" />
                    <h3 className="text-gray-700 text-lg">MXL Upload?</h3>
                </div>
                <div className="mt-12">
                    <p className="text-gray-600 text-base">
                        Das Verarbeiten von .mxl Dateien kann einige Zeit in Anspruch nehmen.
                        <br />
                        Wir emfpehlen die Aufbereitung Notenblättern im MXL Format von einem möglichst leistungsstarken
                        Computer aus durchzuführen, oder das MXL zuvor als Bild oder PDF Datei abzuspeichern und diese
                        Dateien zum Upload zu verwenden.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MxlInfo;
