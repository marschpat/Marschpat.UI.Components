import React, { useContext } from 'react';
import UnlockAspectRatioToggle from './UnlockAspectRatioToggle';
import { MP_EDU } from '../../utils/ImplementationModesLookup';
import { UploaderContext } from '../../context/UploaderContext';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import Button from '@material-ui/core/Button';
import CropIcon from '@material-ui/icons/Crop';
import OrientationToggle from './OrientationToggle';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import IconButton from '@material-ui/core/IconButton';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';

const ImageCropperToolbar = props => {
    const { implementationMode } = useContext(UploaderContext);
    const cropper = props.cropper;

    return (
        <div className="mt-20">
            <div className="flex items-center justify-between">
                <TooltipStyled title="Zoom in 10%">
                    <IconButton onClick={() => cropper.zoom(0.1)}>
                        <ZoomInIcon classes={{ root: 'w-40 h-40' }} />
                    </IconButton>
                </TooltipStyled>

                <TooltipStyled title="Zoom Out 10%">
                    <IconButton onClick={() => cropper.zoom(-0.1)}>
                        <ZoomOutIcon classes={{ root: 'w-40 h-40' }} />
                    </IconButton>
                </TooltipStyled>

                <TooltipStyled title="Links Drehen 1°">
                    <IconButton onClick={() => cropper.rotate(-1)}>
                        <RotateLeftIcon classes={{ root: 'w-40 h-40' }} />
                    </IconButton>
                </TooltipStyled>

                <TooltipStyled title="90° Drehung">
                    <IconButton onClick={() => cropper.rotate(-90)}>
                        <Rotate90DegreesCcwIcon classes={{ root: 'w-40 h-40' }} />
                    </IconButton>
                </TooltipStyled>

                <TooltipStyled title="Rechts Drehen 1°">
                    <IconButton onClick={() => cropper.rotate(1)}>
                        <RotateRightIcon classes={{ root: 'w-40 h-40' }} />
                    </IconButton>
                </TooltipStyled>

                <TooltipStyled title="Alle Seiten in dieser Stimme (Datei) auf die Auswahl zuschneiden">
                    <Button onClick={props.handleCopyCropbox} variant="outlined">
                        <CropIcon />
                        <span className="ml-10">Alle Seiten</span>
                    </Button>
                </TooltipStyled>

                {implementationMode === MP_EDU && (
                    <UnlockAspectRatioToggle handleAspectRatioLockChange={props.handleAspectRatioLockChange} />
                )}

                <OrientationToggle
                    orientation={props.orientation}
                    handleOrientationChange={props.handleOrientationChange}
                />
            </div>
        </div>
    );
};

export default ImageCropperToolbar;
