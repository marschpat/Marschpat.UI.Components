import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CloseButton from '../../utils_2.0/CloseButton';
import VoiceEditorGroup from './VoiceEditorGroup';
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

const VoiceEditor = ({ cast, onVoiceEditorClose }) => {
    const { t } = useTranslation(['uploader']);
    const [isMobile] = useState(window.innerWidth < 720);
    const [castInEdit, setCastInEdit] = useState(cast);
    const [isEditLocked, setIsEditLocked] = useState(0);
    const [isMetadataEditOpen, setIsMetadataEditOpen] = useState(true);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

    class MyMouseSensor extends MouseSensor {
        static activators = [
            {
                eventName: 'onPointerDown',
                handler: ({ nativeEvent: event }) => {
                    if (isEditLocked > 0) {
                        return false;
                    }
                    return true;
                },
            },
        ];
    }
    const mouseSensor = useSensor(isMobile ? MouseSensor : MyMouseSensor, {
        activationConstraint: {
            distance: 12,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 500,
            tolerance: 6,
        },
    });
    const keyboardSensor = useSensor(KeyboardSensor);

    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    useEffect(() => {
        setCastInEdit(cast);
    }, [cast]);

    useEffect(() => {
        if (castInEdit) {
            let castInEditCopy = { ...castInEdit };
            castInEditCopy.instruments.forEach(instrument => {
                instrument.isExpanded = true;
            });
            setCastInEdit(castInEditCopy);
        } else {
            setCastInEdit({ instruments: [], voices: [], name: '' });
        }
    }, []);

    const handleVoiceEditorClose = () => {
        if (castInEdit.name.length < 1) {
            setIsWarningModalOpen(true);
            setIsMetadataEditOpen(true);
            return;
        }
        onVoiceEditorClose(castInEdit);
    };

    const handleDragEnd = event => {
        let castInEditCopy = { ...castInEdit };

        let voice =
            castInEditCopy.instruments[event.active.data.current.groupIndex].voices[
                event.active.data.current.index
            ];
        if (voice && event.over?.data?.current) {
            castInEditCopy.instruments[event.active.data.current.groupIndex].voices.splice(
                event.active.data.current.index,
                1
            );
            castInEditCopy.instruments[event.over.data.current.index].voices.push(voice);

            setCastInEdit(castInEditCopy);
        }
    };

    const updateCastName = newCastName => {
        let castInEditCopy = { ...castInEdit };
        castInEditCopy.name = newCastName;
        setCastInEdit(castInEditCopy);
    };

    const getCastNameError = () => {
        if (!castInEdit) return true;
        if (!castInEdit.name) return true;
        if (castInEdit.name.length > 0) return false;
        return true;
    };

    const getDisplayCastName = () => {
        if (!castInEdit || !castInEdit.name || castInEdit.name.length < 1)
            return t('VOICEEDITOR_CAST_NAME_PLACEHOLDER');
        if (castInEdit.name.length > 30) return castInEdit.name.slice(0, 30) + '...';
        else return castInEdit.name;
    };

    const handleCollapseButtonChange = (index, newState) => {
        let castInEditCopy = { ...castInEdit };
        castInEditCopy.instruments[index].isExpanded = newState;
        setCastInEdit(castInEditCopy);
    };

    const updateInstrumenGroupName = (index, newName) => {
        let castInEditCopy = { ...castInEdit };
        castInEditCopy.instruments[index].name = newName;
        setCastInEdit(castInEditCopy);
    };

    const updateVoiceName = (groupIndex, voiceIndex, newName) => {
        let castInEditCopy = { ...castInEdit };
        if (newName.charAt(0) === 'ㅤ') newName = newName.slice(1);
        else if (newName === '') newName = 'ㅤ';
        castInEditCopy.instruments[groupIndex].voices[voiceIndex].name = newName;
        setCastInEdit(castInEditCopy);
    };

    const getNextHighestVoice = () => {
        let highestVoiceId = 0;
        castInEdit.instruments.forEach(instrument => {
            instrument.voices.forEach(voice => {
                if (voice.voiceId > highestVoiceId) highestVoiceId = voice.voiceId;
            });
        });
        highestVoiceId++;
        return highestVoiceId;
    };

    const addVoice = index => {
        let castInEditCopy = { ...castInEdit };
        let nextVoiceId = getNextHighestVoice();
        castInEditCopy.instruments[index].voices.push({
            name: 'ㅤ',
            voiceId: nextVoiceId,
        });
        setCastInEdit(castInEditCopy);
        return castInEdit.instruments[index].voices.findIndex(
            voice => voice.voiceId === nextVoiceId
        );
    };

    const deleteVoice = (groupIndex, voiceIndex) => {
        let castInEditCopy = { ...castInEdit };
        castInEditCopy.instruments[groupIndex].voices.splice(voiceIndex, 1);
        setCastInEdit(castInEditCopy);
    };

    const addInstrumentGroup = () => {
        let castInEditCopy = { ...castInEdit };
        castInEditCopy.instruments.push({
            name: t('VOICEEDITOR_ADD_INSTRUMENTGROUP_LABEL'),
            voices: [],
            isExpanded: true,
        });
        setCastInEdit(castInEditCopy);
    };

    const deleteInstrumentGroup = index => {
        let castInEditCopy = { ...castInEdit };
        castInEditCopy.instruments.splice(index, 1);
        setCastInEdit(castInEditCopy);
    };

    const handleEditLock = () => {
        setIsEditLocked(isEditLocked + 1);
    };

    const handleEditUnlock = () => {
        setIsEditLocked(isEditLocked - 1);
    };

    return (
        <section className="block w-full h-full p-6 mr-6 bg-gray-200  border border-gray-200 shadow pb-24">
            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                autoScroll={{ acceleration: 1 }}
            >
                <div className="flex flex-col items-start w-full">
                    <div className="flex flex-row w-full">
                        <div className="flex-flex-col items-center w-full ml-8 mr-8">
                            <Button
                                variant="contained"
                                className="flex justify-between w-full mt-24 rounded-md text-white transition-colors bg-blue-600 active:bg-blue-600 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
                                style={{ textTransform: 'none' }}
                                onClick={() => setIsMetadataEditOpen(!isMetadataEditOpen)}
                            >
                                <div className="flex flex-row justify-between w-full">
                                    <div className="flex flex-col items-start justify-start">
                                        <div
                                            className="text-lg font-light italic text-left"
                                            style={{ padding: 0, margin: 0 }}
                                        >
                                            {getDisplayCastName()}
                                        </div>
                                    </div>
                                    {isMetadataEditOpen && (
                                        <CheckIcon className="ml-24 mt-4" style={{ right: 0 }} />
                                    )}
                                    {isMetadataEditOpen || (
                                        <EditIcon className="ml-24 mt-4" style={{ right: 0 }} />
                                    )}
                                </div>
                            </Button>
                            {isMetadataEditOpen && (
                                <div
                                    className="flex p-16 w-full border-b-2 border-l-2 border-r-2 border-white rounded-b-md bg-white text-white"
                                    style={{ color: 'white' }}
                                >
                                    <TextField
                                        className="w-full"
                                        label={t('VOICEEDITOR_CAST_NAME_LABEL')}
                                        value={castInEdit?.name ?? ''}
                                        onChange={event => updateCastName(event.target.value)}
                                        autoFocus={true}
                                        error={getCastNameError()}
                                        helperText={t('VOICEEDITOR_CAST_NAME_HELPERTEXT')}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="w-32 h-32 mt-20 mr-20">
                            <CloseButton onClick={handleVoiceEditorClose} />
                        </div>
                    </div>
                    {castInEdit?.instruments?.length > 0 &&
                        castInEdit?.instruments?.map((instrument, i) => {
                            return (
                                <div key={i} className="flex flex-wrap w-full">
                                    <VoiceEditorGroup
                                        instrument={instrument}
                                        index={i}
                                        onCollapseButtonChange={handleCollapseButtonChange}
                                        onInstrumentGroupNameChange={updateInstrumenGroupName}
                                        onInstrumentGroupDelete={deleteInstrumentGroup}
                                        onVoiceNameChange={updateVoiceName}
                                        onAddVoice={addVoice}
                                        onDeleteVoice={deleteVoice}
                                        onEditLock={handleEditLock}
                                        onEditUnlock={handleEditUnlock}
                                    ></VoiceEditorGroup>
                                </div>
                            );
                        })}
                </div>
            </DndContext>
            <div className="flex flex-wrap mt-16 ml-4">
                <Button
                    className="rounded-full"
                    style={{ textTransform: 'none' }}
                    onClick={() => addInstrumentGroup()}
                >
                    <AddCircleOutlineIcon className="text-grey-700" />
                    <span className="text-grey-700 text-lg font-normal not-uppercase pl-8">
                        {t('VOICEEDITOR_ADD_INSTRUMENTGROUP')}
                    </span>
                </Button>
            </div>
            <Dialog
                open={isWarningModalOpen}
                onClose={() => setIsWarningModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: 'rounded-lg' }}
            >
                <div className="p-24 pt-0 rounded-full">
                    <DialogTitle id="alert-dialog-title" className="text-center font-bold">
                        <h1>{t('VOICEEDITOR_CAST_NAME_WARNING_TITLE')}</h1>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className="text-center">
                            {t('VOICEEDITOR_CAST_NAME_WARNING_TEXT')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="flex items-center justify-center">
                        <div className="flex items-center justify-center">
                            <Button
                                onClick={() => setIsWarningModalOpen(false)}
                                style={{ textTransform: 'none' }}
                                className="flex items-left justify-center bg-grey-200 rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4"
                            >
                                {t('VOICEEDITOR_CAST_NAME_WARNING_CONFIRM')}
                            </Button>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
        </section>
    );
};

export default VoiceEditor;
