import { useState, useEffect } from 'react';
import axios from 'axios';

const useAvailableInstrumentVoices = instrumentSheets => {
    const [castOptions, setCastOptions] = useState(null);
    const [availableInstrumentVoices, setAvailableInstrumentVoices] =
        useState(null);
    const [instrumentVoicesOfCurrentCast, setInstrumentVoicesOfCurrentCast] =
        useState(null);

    useEffect(() => {
        fetchInstrumentVoicesInCastGroups();
    }, []);

    useEffect(() => {
        handleAvailableVoicesUpdate();
    }, [instrumentVoicesOfCurrentCast]);

    const handleCastChange = selectedCast => {
        const availableInstruments = mapCastToInstrumentVoices(selectedCast);
        setInstrumentVoicesOfCurrentCast(availableInstruments);
    };

    const handleAvailableVoicesUpdate = () => {
        let allAssignedVoices = [];
        instrumentSheets.forEach(instrumentSheet => {
            if (instrumentSheet.voices && instrumentSheet.voices.length > 0) {
                allAssignedVoices = allAssignedVoices.concat(
                    instrumentSheet.voices
                );
            }
        });
        const availableVoices = determineRenamingVoices(allAssignedVoices);
        setAvailableInstrumentVoices(availableVoices);
    };

    const handleAvailableVoicesReset = () => {
        setAvailableInstrumentVoices(null);
    };

    return [
        castOptions,
        availableInstrumentVoices,
        handleCastChange,
        handleAvailableVoicesUpdate,
        handleAvailableVoicesReset,
    ];

    function fetchInstrumentVoicesInCastGroups() {
        axios
            .get('/cast')
            .then(response => {
                setCastOptions(mapCasts(response.data));
            })
            .catch(error => {
                console.error(
                    'Fetching castOptions from GET /cast failed with an error.',
                    error
                );
            });
    }

    function determineRenamingVoices(assignedVoices) {
        const assignedIds = assignedVoices.map(item => item.voiceID);
        if (!instrumentVoicesOfCurrentCast) return [];
        const remainingAvailableVoices = instrumentVoicesOfCurrentCast.filter(
            available => !assignedIds.includes(available.voiceID)
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
                        value: voice.voiceID,
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
