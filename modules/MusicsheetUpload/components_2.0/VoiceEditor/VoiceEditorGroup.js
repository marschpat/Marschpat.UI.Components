import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CollapseButton from '../../utils_2.0/CollapseButton';
import VoiceEditorTag from './VoiceEditorTag';
import VoiceEditorModal from './VoiceEditorModal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import TextField from '@material-ui/core/TextField';
import { useDroppable } from '@dnd-kit/core';
import { set } from 'lodash';

const VoiceEditorGroup = ({
    instrument,
    index,
    onCollapseButtonChange,
    onInstrumentGroupNameChange,
    onInstrumentGroupDelete,
    onVoiceNameChange,
    onAddVoice,
    onDeleteVoice,
    onEditLock,
    onEditUnlock,
}) => {
    const { t } = useTranslation(['uploader']);
    const [openVoiceDeleteModal, setopenVoiceDeleteModal] = useState(false);
    const [openInstrumentGroupDeleteModal, setOpenInstrumentGroupDeleteModal] = useState(false);
    const [inNameEditMode, setInNameEditMode] = useState(false);
    const [hovered, setHovered] = useState(null);
    const [inAddOrEdtirVoiceMode, setInAddOrEditVoiceMode] = useState(false);
    const [inAddVoiceMode, setInAddVoiceMode] = useState(false);
    const [tempVoiceInEditIndex, setTempVoiceInEditIndex] = useState(null);
    const [voiceToDeleteIndex, setVoiceToDeleteIndex] = useState(null);
    const [instrumentGroupToDeleteIndex, setInstrumentGroupToDeleteIndex] = useState(null);
    const [tempInstrumentGroupName, setTempInstrumentGroupName] = useState(null);
    const [tempVoiceName, setTempVoiceName] = useState(null);

    const { isOver, setNodeRef } = useDroppable({
        id: 'drop-area-' + index,
        data: {
            accepts: ['voice'],
            index: index,
            voiceInEditIndex: tempVoiceInEditIndex,
        },
    });

    const handleAddVoiceClick = () => {
        setTempVoiceInEditIndex(onAddVoice(index));
        setInAddOrEditVoiceMode(true);
        setInAddVoiceMode(true);
        onEditLock();
    };

    const handleVoiceEditClick = index => {
        setTempVoiceInEditIndex(index);
        setInAddOrEditVoiceMode(true);
        setTempVoiceName(instrument.voices[index].name);
        onEditLock();
    };

    const handleVoiceDeleteClick = i => {
        setVoiceToDeleteIndex({ indexVoice: i, index: index, name: instrument.voices[i].name });
        setopenVoiceDeleteModal(true);
    };

    const handleVoiceEditSubmit = () => {
        if (inAddVoiceMode) setInAddVoiceMode(false);
        if (instrument.voices?.[tempVoiceInEditIndex]?.name === 'ㅤ')
            onDeleteVoice(index, tempVoiceInEditIndex);
        setTempVoiceInEditIndex(null);
        setInAddOrEditVoiceMode(false);
        setTempVoiceName(null);
        onEditUnlock();
    };

    const handleVoiceEditExit = () => {
        if (inAddVoiceMode) {
            onDeleteVoice(index, tempVoiceInEditIndex);
            setInAddVoiceMode(false);
        } else {
            onVoiceNameChange(index, tempVoiceInEditIndex, tempVoiceName);
        }
        setTempVoiceInEditIndex(null);
        setInAddOrEditVoiceMode(false);
        setTempVoiceName(null);
        onEditUnlock();
    };

    const handleOnEditInstrumentGroupNameClick = () => {
        setTempInstrumentGroupName(instrument.name);
        setInNameEditMode(true);
        onEditLock();
    };

    const handleInstrumentGroupNameChangeCancelled = () => {
        if (tempInstrumentGroupName != null)
            onInstrumentGroupNameChange(index, tempInstrumentGroupName);
        setTempInstrumentGroupName(null);
        onEditUnlock();
        setInNameEditMode(false);
    };

    const handleInstrumentGroupNameChangeConfirmed = () => {
        setTempInstrumentGroupName(null);
        onEditUnlock();
        setInNameEditMode(false);
    };

    const handleInstrumentGroupDeleteModalOpen = () => {
        setInstrumentGroupToDeleteIndex(index);
        setOpenInstrumentGroupDeleteModal(true);
    };

    const handleVoiceDialogClose = () => {
        setVoiceToDeleteIndex(null);
        setopenVoiceDeleteModal(false);
    };

    const handleVoiceDialogConfirm = () => {
        if (
            tempVoiceInEditIndex != null &&
            tempVoiceInEditIndex === voiceToDeleteIndex.indexVoice
        ) {
            setTempVoiceInEditIndex(null);
            setInAddOrEditVoiceMode(false);
            setTempVoiceName(null);
            onEditUnlock();
        }
        onDeleteVoice(voiceToDeleteIndex.index, voiceToDeleteIndex.indexVoice);
        setVoiceToDeleteIndex(null);
        setopenVoiceDeleteModal(false);
    };

    const handleInstrumentGroupDialogClose = () => {
        setInstrumentGroupToDeleteIndex(null);
        setOpenInstrumentGroupDeleteModal(false);
    };

    const handleInstrumentGroupDialogConfirm = () => {
        onInstrumentGroupDelete(instrumentGroupToDeleteIndex);
        setInstrumentGroupToDeleteIndex(null);
        setOpenInstrumentGroupDeleteModal(false);
    };

    return (
        <div
            ref={setNodeRef}
            className={
                isOver
                    ? 'flex flex-wrap w-full bg-grey-100 border-blue-600 border-2 rounded-md'
                    : 'flex flex-wrap w-full'
            }
        >
            <div className="flex flex-row w-full h-full mt-12">
                <div className="flex flex-col items-center">
                    <CollapseButton
                        className="w-32 h-32"
                        isExpanded={instrument.isExpanded ?? true}
                        onStateChange={newState => onCollapseButtonChange(index, newState)}
                    ></CollapseButton>
                    {instrument.isExpanded && (
                        <div className="fex w-2 h-full bg-grey-300 rounded-full mb-8"></div>
                    )}
                </div>
                <div className="flex flex-col ml-8 w-full">
                    <div
                        className="flex flex-row items-center w-full"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {!inNameEditMode && (
                            <span className="text-lg w-full mt-12 font-medium text-grey-700">
                                {instrument.name}
                            </span>
                        )}
                        {hovered && !inNameEditMode && (
                            <div className="flex flex-row mt-12 ml-12 mr-12 right-0">
                                <IconButton
                                    aria-label="close"
                                    className="flex w-24 h-24"
                                    onClick={() => handleOnEditInstrumentGroupNameClick()}
                                >
                                    <EditIcon className="text-grey-700 hover:text-blue-600" />
                                </IconButton>
                                <IconButton
                                    aria-label="close"
                                    className="flex w-24 h-24 ml-8"
                                    onClick={() => handleInstrumentGroupDeleteModalOpen()}
                                >
                                    <DeleteIcon className="text-grey-700 hover:text-red-600" />
                                </IconButton>
                            </div>
                        )}
                        {inNameEditMode && (
                            <div className="flex flex-row w-full">
                                <div className="w-full">
                                    <TextField
                                        className="w-full"
                                        label={t('VOICEEDITOR_IINSTRUMENT_NAME_LABEL')}
                                        value={instrument.name}
                                        onChange={event =>
                                            onInstrumentGroupNameChange(index, event.target.value)
                                        }
                                        autoFocus={true}
                                        error={instrument.name?.length < 1}
                                    />
                                </div>

                                <div className="flex flex-row mt-12 ml-12 mr-12">
                                    <IconButton
                                        aria-label="close"
                                        className="flex w-24 h-24"
                                        onClick={() => handleInstrumentGroupNameChangeConfirmed()}
                                    >
                                        <CheckIcon className="text-grey-700 hover:text-blue-600" />
                                    </IconButton>
                                    <IconButton
                                        aria-label="close"
                                        className="flex w-24 h-24 ml-8"
                                        onClick={() => handleInstrumentGroupNameChangeCancelled()}
                                    >
                                        <CloseIcon className="text-grey-700 hover:text-red-600" />
                                    </IconButton>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap">
                        {instrument.isExpanded &&
                            instrument.voices?.length > 0 &&
                            instrument.voices.map((voice, j) => {
                                return (
                                    <VoiceEditorTag
                                        key={j}
                                        voice={voice}
                                        index={j}
                                        groupIndex={index}
                                        inEditIndex={tempVoiceInEditIndex}
                                        isOverGroup={isOver}
                                        onVoiceClick={handleVoiceEditClick}
                                        onVoiceEditClick={handleVoiceEditClick}
                                        onVoiceDeleteClick={handleVoiceDeleteClick}
                                    />
                                );
                            })}
                        <div className="flex flex-row w-full">
                            {!inAddOrEdtirVoiceMode && instrument.isExpanded && (
                                <Button
                                    className="rounded-full flex items-start h-32 mt-16"
                                    onClick={() => handleAddVoiceClick()}
                                >
                                    <AddCircleOutlineIcon
                                        className="bg-gray-200 h-24 w-24 mr-8"
                                        style={{
                                            color: 'rgb(220, 173, 85)',
                                            active: { color: 'rgb(220, 173, 85)' },
                                            hover: { color: 'rgb(220, 173, 85)' },
                                        }}
                                    />
                                    <span
                                        className="text-s font-normal not-uppercase"
                                        style={{
                                            textTransform: 'none',
                                            color: 'rgb(220, 173, 85)',
                                            active: { color: 'rgb(220, 173, 85)' },
                                            hover: { color: 'rgb(220, 173, 85)' },
                                        }}
                                    >
                                        {t('VOICEEDITOR_ADD_VOICE')}
                                    </span>
                                </Button>
                            )}
                            {inAddOrEdtirVoiceMode && (
                                <div className="flex flex-row w-full">
                                    <div className="w-full">
                                        <TextField
                                            className="w-full mt-12 ml-4 mr-12"
                                            label={t('VOICEEDITOR_IINSTRUMENT_NAME_LABEL')}
                                            value={
                                                instrument.voices?.[tempVoiceInEditIndex]?.name ??
                                                ''
                                            }
                                            onChange={event =>
                                                onVoiceNameChange(
                                                    index,
                                                    tempVoiceInEditIndex,
                                                    event.target.value
                                                )
                                            }
                                            autoFocus={true}
                                            error={instrument.name?.length < 1}
                                        />
                                    </div>

                                    <div className="flex flex-row mt-12 ml-4 mt-24 mr-12">
                                        <IconButton
                                            aria-label="close"
                                            className="flex w-24 h-24"
                                            onClick={handleVoiceEditSubmit}
                                        >
                                            <CheckIcon className="text-grey-700 hover:text-blue-600" />
                                        </IconButton>
                                        <IconButton
                                            aria-label="close"
                                            className="flex w-24 h-24 ml-8"
                                            onClick={handleVoiceEditExit}
                                        >
                                            <CloseIcon className="text-grey-700 hover:text-red-600" />
                                        </IconButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <VoiceEditorModal
                open={openVoiceDeleteModal}
                title={t('VOICEEDITOR_DELETE_VOICE_TITLE')}
                text={t('VOICEEDITOR_DELETE_VOICE_TEXT')}
                objectName={voiceToDeleteIndex?.name}
                cancelText={t('VOICEEDITOR_DELETE_CANCEL')}
                confirmText={t('VOICEEDITOR_DELETE_CONFIRM')}
                onConfirm={handleVoiceDialogConfirm}
                onCancel={handleVoiceDialogClose}
            />
            <VoiceEditorModal
                open={openInstrumentGroupDeleteModal}
                title={t('VOICEEDITOR_DELETE_INSTRUMENTGROUP_TITLE')}
                text={t('VOICEEDITOR_DELETE_INSTRUMENTGROUP_TEXT')}
                objectName={instrument.name}
                cancelText={t('VOICEEDITOR_DELETE_CANCEL')}
                confirmText={t('VOICEEDITOR_DELETE_CONFIRM')}
                onConfirm={handleInstrumentGroupDialogConfirm}
                onCancel={handleInstrumentGroupDialogClose}
            />
        </div>
    );
};

export default VoiceEditorGroup;
