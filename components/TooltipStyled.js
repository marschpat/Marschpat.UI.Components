import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const TooltipStyled = ({ title, children, isOpen, setIsOpen = () => {} }) => {
    return (
        <Tooltip
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            title={<span className="text-lg leading-snug">{title}</span>}
        >
            {children}
        </Tooltip>
    );
};

export default TooltipStyled;
