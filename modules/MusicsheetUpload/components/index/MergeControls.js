import React, { useState, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';

const MergeControls = props => {
    const inMergeMode = props.inMergeMode;
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(props.isMergeChild);
    }, [props.isMergeChild]);

    const handleToggle = () => {
        setChecked(!checked);
        props.handleToggleMergeChildren(props.instrumentSheetId)
    }

    return !inMergeMode ? (
        <div className="inline-block">
            {props.wasMerged && <div className="inline-block" title="Zusammengefügte Stimmen">
                <EmojiFlagsIcon className="mr-20 text-mp-gold"/>
            </div>}
            {props.renderMergeButton && <IconButton
                onClick={() => props.handleActivateMergeMode(props.instrumentSheetId)}
                aria-label="merge-instrument-voices"
                title="Stimmen zusammen führen"
            >
                <MergeTypeIcon />
            </IconButton>}
        </div>
    ) : (
        <div className="inline-block">
            {props.isParent ? (
                <>
                    <IconButton
                        onClick={props.handleConfirmMerge}
                        aria-label="confirm-merge"
                        title="Stimmen zusammen führen"
                    >
                        <DoneIcon />
                    </IconButton>
                    <IconButton
                        onClick={props.handleCancelMergeMode}
                        aria-label="cancel-merge"
                        title="Zusammen führen abbrechen"
                    >
                        <CloseIcon />
                    </IconButton>
                </>
            ) : (
                <div>
                    <Checkbox
                        edge="start"
                        checked={checked}
                        onChange={handleToggle}
                    />
                </div>
            )}
        </div>
    );
}

export default MergeControls;
