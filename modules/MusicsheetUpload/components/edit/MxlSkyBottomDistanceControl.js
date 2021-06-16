import React, { useState, useEffect } from 'react';
import TooltipStyled from '../TooltipStyled';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const MxlSkyBottomDistanceControl = props => {
    const [skyBottomDistance, setSkyBottomDistance] = useState(0);

    const changeSkyBottomDistance = (e, value) => {
        setSkyBottomDistance(value);
        props.handleSkyBottomDistanceChange(value);
    }

    useEffect(() => {
        setSkyBottomDistance(props.skyBottomDistance)
    }, [props.skyBottomDistance])

    return (
        <div className="ml-20">
                <TooltipStyled title="Abstand zwischen Notenzeilen einstellen">
                    <div className="cursor-pointer">
                        <Typography id="distanceSkyBottomSystem-slider" gutterBottom className="text-center text-gray-500 text-lg font-semibold">
                            Abstand
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
    )

}

export default MxlSkyBottomDistanceControl;
