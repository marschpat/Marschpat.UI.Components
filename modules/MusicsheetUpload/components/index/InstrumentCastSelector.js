import React, { useState, useEffect } from 'react';
import InfoTooltip from '../InfoTooltip';
import useDispatchConfirmDialog from '@marschpat/local/utils/useDispatchConfirmDialog';
import InputErrorMessage from '@marschpat/Marschpat.UI.Components/components/InputErrorMessage';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

const InstrumentCastSelector = props => {
    const dispatchConfirm = useDispatchConfirmDialog();
    const showError = props.error ? true : false;
    const castOptions = props.castOptions ?? null;
    const [selectedCast, setSelectedCast] = useState(null);

    const handleChange = cast => {
        if (selectedCast?.id === cast.id) return;
        props.handleVoicesAssignementReset();
        setSelectedCast(cast);
    };

    const handleCastChange = cast => {
        const warningRequired = props.castWarningRequired();
        if (!warningRequired) handleChange(cast);
        if (warningRequired) {
            dispatchConfirm(
                () => handleChange(cast),
                'Besetzung wirklich ändern?',
                'Besetzung wirklich ändern? Zuordnung bereits zugewiesener Stimmen gehen dadurch verloren.',
                'Besetzung ändern'
            );
        }
    };

    // Update selected cast
    useEffect(() => {
        props.handleCastChange(selectedCast);
    }, [selectedCast]);

    // Set initial cast if provided
    useEffect(() => {
        if (castOptions && props.initialCast) {
            const castId = props.initialCast;
            const initialCastItem = castOptions.find(item => item.value === castId);
            setSelectedCast(initialCastItem);
        }
    }, [castOptions, props.initialCast]);

    useEffect(() => {
        if (props.resetState) {
            setSelectedCast(null);
        }
    }, [props.resetState]);

    return (
        <div className="max-w-640 w-full mt-20 mr-36">
            <FuseChipSelect
                value={selectedCast}
                onChange={handleCastChange}
                placeholder="Besetzung auswählen"
                textFieldProps={{
                    label: 'Besetzung',
                    InputLabelProps: {
                        shrink: true,
                    },
                    variant: 'outlined',
                }}
                options={castOptions}
                required
                error={showError}
                variant="fixed"
                id="cast"
            />
            <InputErrorMessage msg={props?.error?.msg} condition={showError} />
            <div className="my-10 flex items-center justify-between">
                <p className="text-base text-orange-300 font-bold">
                    Wie funktioniert die "Besetzung"?
                </p>
                <InfoTooltip
                    name="instrument-cast-info"
                    title="Die Wahl der Besetzung hat Auswirkung auf die zur Verfügung stehenden Instrumentenstimmen und Zuordnung in MARSCHPAT!"
                />
            </div>
        </div>
    );
};

export default InstrumentCastSelector;
