import React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';

function InfoPopover(props) {
    return (
        <div className={props.className ?? ''}>
            <TooltipStyled title="Die Wahl der Besetzung hat Auswirkung auf die zur Verfügung stehenden Instrumentenstimmen und Zuordnung in MARSCHPAT!">
                <IconButton
                    className="text-orange-300"
                    color="inherit"
                    aria-label="cast-information"
                >
                    <Icon>info</Icon>
                </IconButton>
            </TooltipStyled>
        </div>
    );
}

export default InfoPopover;
