import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const TooltipStyled = props => {
    return <Tooltip title={<span className="text-lg leading-snug">{props.title}</span>}>{props.children}</Tooltip>;
};

export default TooltipStyled;
