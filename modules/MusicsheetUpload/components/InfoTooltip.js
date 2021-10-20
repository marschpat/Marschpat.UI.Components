import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';

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
                    <EmojiObjectsOutlinedIcon className="text-3xl" fontSize="inherit" />
                </IconButton>
            </TooltipStyled>
        </div>
    );
}

export default InfoTooltip;
