import React, { useState, useEffect } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { useTranslation } from 'react-i18next';

const MxlSkyBottomDistanceControl = props => {
    const { t } = useTranslation(['uploader']);
    const [skyBottomDistance, setSkyBottomDistance] = useState(0);

    const changeSkyBottomDistance = (e, value) => {
        setSkyBottomDistance(value);
        props.handleSkyBottomDistanceChange(value);
    };

    useEffect(() => {
        setSkyBottomDistance(props.skyBottomDistance);
    }, [props.skyBottomDistance]);

    return (
        <div className="ml-20">
            <TooltipStyled title={t('UPLOADER_MXL_DISTANCECONTROL')}>
                <div className="cursor-pointer">
                    <Typography
                        id="distanceSkyBottomSystem-slider"
                        gutterBottom
                        className="text-center text-gray-500 text-lg font-semibold"
                    >
                        {t('UPLOADER_MXL_DISTANCE')}
                    </Typography>
                </div>
            </TooltipStyled>

            <Slider
                value={skyBottomDistance}
                onChange={changeSkyBottomDistance}
                min={0}
                max={20}
                step={1}
                marks={true}
                valueLabelDisplay="auto"
                aria-labelledby="distanceSkyBottomSystem-slider"
                className="w-320 text-gray-700"
            />
        </div>
    );
};

export default MxlSkyBottomDistanceControl;
