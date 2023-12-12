import React, { useContext, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const VoiceEditorTag = ({
    voice,
    index,
    groupIndex,
    inEditIndex,
    isOverGroup,
    onVoiceClick,
    onVoiceEditClick,
    onVoiceDeleteClick,
}) => {
    const [hovered, setHovered] = useState(false);

    const { attributes, listeners, setNodeRef, isOver, isDragging, transform } = useDraggable({
        id: `voice-${index}-${groupIndex}`,
        snapToCursor: true,
        data: {
            type: 'voice',
            index: index,
            groupIndex: groupIndex,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const handleOnEditClick = () => {
        onVoiceEditClick(index);
    };

    const handleOnDeleteClick = () => {
        onVoiceDeleteClick(index);
    };

    const getVoiceDisplayName = name => {
        if (name.length > 50) return name.slice(0, 50) + '...';
        else return name;
    };

    return (
        <div
            key={index}
            {...attributes}
            {...listeners}
            ref={inEditIndex ? null : setNodeRef}
            style={style}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={
                index === inEditIndex
                    ? 'flex justify-center items-center mt-12 mr-12 border-2 border-blue-600 rounded-full'
                    : 'flex justify-center items-center mt-12 mr-12'
            }
        >
            <Button
                disabled={hovered && !isDragging}
                variant="contained"
                className="flex items-center bg-white hover:bg-white rounded-full text-black"
                style={{
                    textTransform: 'none',
                    zIndex: isDragging ? 1000 : 1,
                }}
                onClick={onVoiceClick}
            >
                <span className="text-s not-uppercase">{getVoiceDisplayName(voice.name)}</span>
            </Button>
            {hovered && !isOverGroup && !isDragging && (
                <div className="absolute flex flex-row">
                    <IconButton
                        aria-label="edit"
                        className="flex w-24 h-24"
                        onClick={handleOnEditClick}
                    >
                        {' '}
                        <EditIcon className="text-gray-800 hover:text-blue-600" />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        className="flex w-24 h-24 ml-8"
                        onClick={handleOnDeleteClick}
                    >
                        {' '}
                        <DeleteIcon className="text-gray-800 hover:text-red-600" />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default VoiceEditorTag;
