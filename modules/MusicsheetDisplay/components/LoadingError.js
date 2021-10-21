import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { clientRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const LoadingError = ({ errorMsg }) => {
    const history = useHistory();
    const { implementationMode } = useContext(MusicsheetLoaderContext);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <CancelOutlinedIcon className="w-76 h-76 text-red-800" />
            <div className="my-20 text-red-800">
                <h6 className="text-2xl font-bold">Fehler beim laden des Musikstücks</h6>
                <p className="text-lg text-center">{errorMsg}</p>
            </div>
            <button onClick={() => history.goBack()} className="text-red-800">
                Zurück
            </button>
            <Link to={clientRoutes[implementationMode].musiclibrary}>Zur Library</Link>
        </div>
    );
};

export default LoadingError;
