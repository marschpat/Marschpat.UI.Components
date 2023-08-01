import React, { useState, useEffect } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import { useTranslation } from 'react-i18next';

const MergeControls = props => {
    const inMergeMode = props.inMergeMode;
    const [checked, setChecked] = useState(false);
    const { t } = useTranslation(['uploader']);

    useEffect(() => {
        setChecked(props.isMergeChild);
    }, [props.isMergeChild]);

    const handleToggle = () => {
        setChecked(!checked);
        props.handleToggleMergeChildren(props.instrumentSheetId);
    };

    return !inMergeMode ? (
        <div className="inline-block">
            {props.wasMerged && (
                <div className="inline-block" title={t('UPLOADER_VOICES_MERGED_TTP')}>
                    <EmojiFlagsIcon className="mr-20 text-mp-gold" />
                </div>
            )}
            {props.renderMergeButton && (
                <IconButton
                    onClick={() => props.handleActivateMergeMode(props.instrumentSheetId)}
                    aria-label="merge-instrument-voices"
                    title={t('UPLOADER_VOICES_MERGE_ACTION')}
                >
                    <MergeTypeIcon />
                </IconButton>
            )}
        </div>
    ) : (
        <div className="inline-block">
            {props.isParent ? (
                <>
                    <IconButton
                        onClick={props.handleConfirmMerge}
                        aria-label="confirm-merge"
                        title={t('UPLOADER_VOICES_MERGE_ACTION')}
                    >
                        <DoneIcon />
                    </IconButton>
                    <IconButton
                        onClick={props.handleCancelMergeMode}
                        aria-label="cancel-merge"
                        title={t('UPLOADER_VOICES_MERGE_CANCEL')}
                    >
                        <CloseIcon />
                    </IconButton>
                </>
            ) : (
                <div>
                    <Checkbox edge="start" checked={checked} onChange={handleToggle} />
                </div>
            )}
        </div>
    );
};

export default MergeControls;
