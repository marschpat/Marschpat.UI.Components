import React, { useState, useEffect, useContext } from 'react';
import InfoTooltip from '../InfoTooltip';
import { UploaderContext } from '../../context/UploaderContext';
import useDispatchConfirmDialog from '@marschpat/local/utils/useDispatchConfirmDialog';
import InputErrorMessage from '@marschpat/Marschpat.UI.Components/components/InputErrorMessage';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import { useTranslation } from 'react-i18next';

const InstrumentCastSelector = props => {
    const { t } = useTranslation(['uploader']);
    const dispatchConfirm = useDispatchConfirmDialog();
    const showError = props.error ? true : false;
    const castOptions = props.castOptions ?? [];
    const [selectedCast, setSelectedCast] = useState(null);
    const { inHelpMode } = useContext(UploaderContext);

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
                t('CAST_WARNING_HL'),
                t('CAST_WARNING_TEXT'),
                t('CAST_WARNING_CONFIRM')
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
        <div className="max-w-512 w-full mt-20 mr-36">
            <FuseChipSelect
                value={selectedCast}
                onChange={handleCastChange}
                placeholder={t('CAST_SELECT')}
                textFieldProps={{
                    label: t('CAST'),
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
            {inHelpMode && (
                <div className="my-10 flex items-center justify-between">
                    <p className="text-base text-orange-300 font-bold">
                        Wie funktioniert die "Besetzung"?
                    </p>
                    <InfoTooltip
                        name="instrument-cast-info"
                        title="Die Wahl der Besetzung hat Auswirkung auf die zur Verfügung stehenden Instrumentenstimmen und Zuordnung in MARSCHPAT!"
                    />
                </div>
            )}
        </div>
    );
};

export default InstrumentCastSelector;
