import { useState, useEffect } from 'react';
import axios from 'axios';
import { MP_EDU, MP_WEB } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';

const useAvailableInstrumentVoices = (
    instrumentSheets,
    implementationMode,
    organisation = null
) => {
    const [castOptions, setCastOptions] = useState(null); // used | all casts | scope MusicPiece (Global)
    const [availableInstrumentVoices, setAvailableInstrumentVoices] = useState(null); // used | all voices of selecte cast (changes on "handleCastChange") | scope MusicPiece
    const [instrumentVoicesOfCurrentCast, setInstrumentVoicesOfCurrentCast] = useState(null); // used | listener variable that triggers "handleAvailableVoicesUpdate" when changed | scope MusicPiece

    useEffect(() => {
        fetchInstrumentVoicesInCastGroups();
    }, []);

    /**useEffect(() => {
        handleAvailableVoicesUpdate();
        console.log('instrumentSheets: ', instrumentSheets);
    }, [instrumentSheets]);

    useEffect(() => {
        handleAvailableVoicesUpdate();
    }, [instrumentVoicesOfCurrentCast]);*/

    const handleCastChange = selectedCast => {
        const availableInstruments = mapCastToInstrumentVoices(selectedCast);
        setInstrumentVoicesOfCurrentCast(availableInstruments);
    };

    const handleAvailableVoicesUpdate = () => {
        let allAssignedVoices = [];
        instrumentSheets?.forEach(instrumentSheet => {
            if (instrumentSheet.voices && instrumentSheet.voices.length > 0) {
                allAssignedVoices = allAssignedVoices.concat(instrumentSheet.voices);
            }
        });
        const availableVoices = determineRenamingVoices(allAssignedVoices);
        setAvailableInstrumentVoices(availableVoices);
    };

    const handleAvailableVoicesReset = () => {
        setAvailableInstrumentVoices(null);
    };

    // In Marschpat EDU there are no casts, neither a concept for "available voices". So we can bypass everything related to
    // castOptions, availableInstrumentVoices, handleCastChange, handleAvailableVoicesUpdate, handleAvailableVoicesReset
    if (implementationMode === MP_EDU) return [false, false, () => false, () => false, () => false];

    return [
        castOptions,
        availableInstrumentVoices,
        handleCastChange, // only updates availableInstrumentVoices
        handleAvailableVoicesUpdate, // takes selectedCast as input and updates availableInstrumentVoices
        handleAvailableVoicesReset, // just sets availableInstrumentVoices to null
    ];

    // used | gets all casts and all voices from api | scope MusicPiece (Global)
    function fetchInstrumentVoicesInCastGroups() {
        const castRoute =
            implementationMode === MP_WEB && organisation
                ? `/cast?organisationId=${organisation.organisationId}`
                : '/cast';

        axios
            .get(castRoute)
            .then(response => {
                setCastOptions(mapCasts(response.data));
            })
            .catch(error => {
                console.error(
                    `Fetching castOptions from GET ${castRoute} failed with an error.`,
                    error
                );
            });
    }

    function determineRenamingVoices(assignedVoices) {
        const assignedIds = assignedVoices.map(item => item.voiceId);
        if (!instrumentVoicesOfCurrentCast) return [];
        const remainingAvailableVoices = instrumentVoicesOfCurrentCast.filter(
            available => !assignedIds.includes(available.voiceId)
        );

        return remainingAvailableVoices;
    }

    function mapCastToInstrumentVoices(castItem) {
        if (!castItem) {
            return null;
        }

        return castItem?.groups?.flatMap(group => {
            return group?.instruments?.flatMap(instrument => {
                return instrument?.voices?.map(voice => {
                    return {
                        value: voice.voiceId,
                        label: voice.name,
                        group: group.name,
                        instrument: instrument.name,
                        ...voice,
                    };
                });
            });
        });
    }

    function mapCasts(castItems) {
        return castItems.map(item => ({
            value: item.id,
            label: item.name,
            groups: item.groups,
            ...item,
        }));
    }
};

export default useAvailableInstrumentVoices;
