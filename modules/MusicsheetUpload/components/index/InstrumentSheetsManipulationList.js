import React, { useContext, useState } from 'react';
import InstrumentSheetListItem from './InstrumentSheetListItem';
import { UploaderContext } from '../../context/UploaderContext';
import useDispatchConfirmDialog from '@marschpat/local/utils/useDispatchConfirmDialog';
import List from '@material-ui/core/List';

const InstrumentSheetsManipulationList = props => {
    const instrumentSheets = props.instrumentSheets;
    const renderMergeButton = instrumentSheets.length > 1;
    const [mergeParent, setMergeParent] = useState(null);
    const [inMergeMode, setInMergeMode] = useState(false);
    const [mergeChildren, setMergeChildren] = useState([]);
    const dispatchConfirm = useDispatchConfirmDialog();
    const { dispatchFlashMessage } = useContext(UploaderContext);

    const activateMergeMode = uuid => {
        setMergeParent(uuid);
        setInMergeMode(true);
    };
    const cancelMergeMode = () => {
        setMergeParent(null);
        setMergeChildren([]);
        setInMergeMode(false);
    };
    const toggleMergeChildren = v => {
        const currentIndex = mergeChildren.indexOf(v);
        const newChecked = [...mergeChildren];
        if (currentIndex === -1) {
            newChecked.push(v);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setMergeChildren(newChecked);
    };
    const mergeSheets = () => {
        // get the parent
        const parent = findInstrumentSheetsByUuid(mergeParent);
        if (parent.length < 1) return false;
        let newInstrumentSheet = parent[0];
        if (!newInstrumentSheet.previews) {
            newInstrumentSheet.previews = [];
        }

        // get each child
        const childs = mergeChildren.flatMap(childId => findInstrumentSheetsByUuid(childId));
        if (childs.length < 1) return false;

        // merge them
        childs.forEach(child => {
            newInstrumentSheet.origFiles = newInstrumentSheet.origFiles.concat(child.origFiles);
            newInstrumentSheet.pages = newInstrumentSheet.pages.concat(child.pages);
            newInstrumentSheet.voices = newInstrumentSheet.voices.concat(child.voices);
            if (child.previews) {
                newInstrumentSheet.previews = newInstrumentSheet.previews.concat(child.previews);
            }
        });

        newInstrumentSheet.dirty = true;

        props.handleRemoveInstrumentSheets(childs.map(child => child.uuid));
        setInMergeMode(false);
        dispatchFlashMessage('Stimmen erfolgreich zusammen geführt', 'success');
    };

    const handleConfirmMerge = () => {
        dispatchConfirm(
            mergeSheets,
            'Stimmen wirklich zusammenführen?',
            'Stimmen wirklich zusammenführen? Diese Aktion kann nicht rückgängig gemacht werden. Bearbeitungsvortschritt in den Stimmen geht gegebenenfalls verloren.',
            'Stimmen zusammenführen'
        );
    };

    return (
        <List>
            {instrumentSheets.map(instrumentSheet => {
                return (
                    <InstrumentSheetListItem
                        inMergeMode={inMergeMode}
                        mergeParent={mergeParent === instrumentSheet.uuid ? mergeParent : null}
                        mergeChildren={mergeChildren.includes(instrumentSheet.uuid) ? mergeChildren : null}
                        instrumentSheet={instrumentSheet}
                        renderMergeButton={renderMergeButton}
                        handleRemoveInstrumentSheets={props.handleRemoveInstrumentSheets}
                        handleOpenInstrumentSheetEdit={props.handleOpenInstrumentSheetEdit}
                        handleConfirmMerge={handleConfirmMerge}
                        handleActivateMergeMode={activateMergeMode}
                        handleCancelMergeMode={cancelMergeMode}
                        handleToggleMergeChildren={toggleMergeChildren}
                        key={instrumentSheet.uuid}
                    />
                );
            })}
        </List>
    );

    function findInstrumentSheetsByUuid(uuid) {
        return instrumentSheets.filter(sheet => sheet.uuid === uuid);
    }
};

export default InstrumentSheetsManipulationList;
