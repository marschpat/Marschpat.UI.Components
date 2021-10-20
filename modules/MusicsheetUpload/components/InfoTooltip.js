import React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';

function InfoTooltip(props) {
    return (
        <div className={props.className ?? ''}>
            <TooltipStyled title={props.title ?? ''}>
                <IconButton
                    className="text-orange-300"
                    color="inherit"
                    aria-label={props.name ?? 'information'}
                    size="small"
                >
                    <Icon>info</Icon>
                </IconButton>
            </TooltipStyled>
        </div>
    );
}

export default InfoTooltip;
