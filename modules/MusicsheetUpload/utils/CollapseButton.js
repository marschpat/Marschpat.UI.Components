import React, { useContext, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const CollapseButton = ({ isExpanded, onStateChange }) => {
    const handleExpandClick = () => {
        onStateChange(true);
    };

    const handleCollapseClick = () => {
        onStateChange(false);
    };

    return (
        <div className="App flex space-x-4">
            {isExpanded && (
                <IconButton onClick={handleCollapseClick} className="bg-gray-200">
                    <ExpandLessIcon />
                </IconButton>
            )}

            {!isExpanded && (
                <IconButton onClick={handleExpandClick} className="bg-gray-200">
                    <ExpandMoreIcon />
                </IconButton>
            )}
        </div>
    );
};

export default CollapseButton;
