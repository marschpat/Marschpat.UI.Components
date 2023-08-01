import React from 'react';
import MergeControls from './MergeControls';
import DeleteInstrumentSheetButton from './DeleteInstrumentSheetButton';
import { getCompletionStatus } from '../../utils/InstrumentSheetsHelper';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ImageIcon from '@material-ui/icons/Image';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { useTranslation } from 'react-i18next';

const InstrumentSheetListItem = props => {
    const { t } = useTranslation(['uploader']);
    const allowedMergeTypes = ['pdf', 'image'];
    const sheetType = props.instrumentSheet.origFiles[0].type;
    const allowMergeMode = allowedMergeTypes.includes(sheetType);

    return (
        <ListItem
            role={undefined}
            dense
            button
            onClick={() => props.handleOpenInstrumentSheetEdit(props.instrumentSheet)}
            divider
        >
            <ListItemIcon className="flex items-center">
                <FileTypeIcon type={sheetType} />
            </ListItemIcon>
            <ListItemText
                className="w-full"
                id={`checkbox-list-label-${props.instrumentSheet.uuid}`}
                primary={props.instrumentSheet.origFiles[0].name}
                secondary={<PageInformation instrumentSheet={props.instrumentSheet} />}
            />
            <ListItemText className="w-full">
                <CompletionStatus instrumentSheet={props.instrumentSheet} />
            </ListItemText>
            <ListItemSecondaryAction>
                {allowMergeMode && (
                    <MergeControls
                        inMergeMode={props.inMergeMode}
                        isParent={props.instrumentSheet.uuid === props.mergeParent}
                        isMergeChild={
                            props.mergeChildren?.includes(props.instrumentSheet.uuid) ?? false
                        }
                        wasMerged={props.instrumentSheet.origFiles.length > 1}
                        renderMergeButton={props.renderMergeButton}
                        instrumentSheetId={props.instrumentSheet.uuid}
                        handleConfirmMerge={props.handleConfirmMerge}
                        handleCancelMergeMode={props.handleCancelMergeMode}
                        handleActivateMergeMode={props.handleActivateMergeMode}
                        handleToggleMergeChildren={props.handleToggleMergeChildren}
                    />
                )}
                <DeleteInstrumentSheetButton
                    sheetId={props.instrumentSheet.uuid}
                    handleRemoveInstrumentSheets={props.handleRemoveInstrumentSheets}
                />
                <IconButton
                    edge="end"
                    aria-label="edit-instrument-voice"
                    title={t('UPLOADER_VOICE_EDIT_ACTION')}
                >
                    <ChevronRightIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

function FileTypeIcon({ type }) {
    if (type === 'mxl') return <DescriptionIcon />;
    if (type === 'image') return <ImageIcon />;
    if (type === 'pdf') return <PictureAsPdfIcon />;

    return <WarningIcon />;
}

function CompletionStatus({ instrumentSheet }) {
    const { t } = useTranslation(['uploader']);
    const [completed, voicesReady, pagesReady] = getCompletionStatus(instrumentSheet);
    const voicesNames = voicesReady()
        ? instrumentSheet.voices.map(voice => voice.label).join(', ')
        : null;
    const labelText = () => {
        if (completed) return voicesNames;
        if (voicesReady() && !pagesReady()) return voicesNames + t('UPLOADER_VOICE_EDIT_NOTICE');
        return t('UPLOADER_VOICE_EDIT_STATUS_NOTICE');
    };

    return (
        <Chip
            icon={completed ? <CheckCircleIcon /> : <WarningIcon />}
            label={labelText()}
            className={
                completed
                    ? 'px-6 max-w-xs truncate cursor-pointer bg-green-300'
                    : 'px-6 cursor-pointer bg-grey-300'
            }
            title={`${t('UPLOADER_VOICES_ASSIGNED')} ${voicesNames}`}
            id="completion-status"
        />
    );
}

function PageInformation({ instrumentSheet }) {
    const { t } = useTranslation(['uploader']);
    const pageCount = instrumentSheet.pages.length;
    const isDirty = instrumentSheet?.dirty ?? false;
    const showPagesCount = !isDirty && instrumentSheet.pages.length > 0;
    return showPagesCount && <span>{`${t('UPLOADER_PAGES')} ${pageCount}`}</span>;
}

export default InstrumentSheetListItem;
