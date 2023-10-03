import React, { useState, useEffect, useContext } from 'react';
import InfoTooltip from '../InfoTooltip';
import { UploaderContext } from '../../context/UploaderContext';
import useDispatchConfirmDialog from '@marschpat/local/utils/useDispatchConfirmDialog';
import InputErrorMessage from '@marschpat/Marschpat.UI.Components/components/InputErrorMessage';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { set } from 'lodash';

const InstrumentCastSelector = props => {
    const { t } = useTranslation(['uploader']);
    const dispatchConfirm = useDispatchConfirmDialog();
    const showError = props.error ? true : false;
    const castOptions = props.castOptions ?? [];
    const [selectedCast, setSelectedCast] = useState(props.initialCast);
    const [tempSelectedCast, setTempSelectedCast] = useState(null);
    const [igonreCastChange, setIgnoreCastChange] = useState(false);
    const [isFirstCastChange, setIsFirstCastChange] = useState(true);
    const { inHelpMode, selectedMusicPieceIndex } = useContext(UploaderContext);
    const [openInstrumentationConfirmationModal, setOpenInstrumentationConfirmationModal] =
        useState(false);

    const handleChange = cast => {
        if (selectedCast?.id === cast.id) return;

        if (selectedCast == null) {
            //props.handleVoicesAssignementReset();
            setSelectedCast(cast);
            return;
        }

        setTempSelectedCast(cast);
        handleClickOpen();
    };

    {
        /**const handleCastChange = cast => {
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
    };**/
    }

    const handleClickOpen = () => {
        setOpenInstrumentationConfirmationModal(true);
    };

    const handleClose = () => {
        setOpenInstrumentationConfirmationModal(false);
    };

    const handleConfirm = () => {
        //props.handleVoicesAssignementReset();
        setSelectedCast(tempSelectedCast);
        setOpenInstrumentationConfirmationModal(false);
    };

    // Update selected cast
    useEffect(() => {
        console.log('selected cast: ', selectedCast);
        console.log('is first cast change: ', isFirstCastChange);
        if (isFirstCastChange && selectedCast?.value != null) {
            setIsFirstCastChange(false);
            props.handleCastChange(selectedCast);
            return;
        }
        if (igonreCastChange) {
            setIgnoreCastChange(false);
            return;
        }
        if (selectedCast != null) props.handleCastChange(selectedCast);
        if (selectedCast == undefined) setSelectedCast({});
    }, [selectedCast]);

    // Set initial cast if provided
    useEffect(() => {
        if (castOptions && props.initialCast) {
            const castId = props.initialCast.id;
            const initialCastItem = castOptions.find(item => item.value === castId);
            console.log('initial cast item: ', initialCastItem);
            setIgnoreCastChange(true);
            if (initialCastItem === undefined) setSelectedCast(null);
            else setSelectedCast(initialCastItem);
        } else if (props.initialCast == null) {
            setSelectedCast(null);
        }
    }, [castOptions, props.initialCast]);

    useEffect(() => {
        if (props.resetState) {
            console.log('resetting cast');
            setSelectedCast({ ...props.initialCast });
        }
    }, [props.resetState]);

    return (
        <div className="max-w-512 w-full mt-20 mr-36">
            <p className="text-gray-700 text-lg mb-4 font-semibold">{t('CAST')}</p>
            <FuseChipSelect
                className="bg-white"
                value={selectedCast}
                onChange={handleChange}
                placeholder={t('CAST_SELECT')}
                textFieldProps={{
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
                    <p className="text-base text-orange-300 font-bold">{t('UPLOADER_HOWTOCAST')}</p>
                    <InfoTooltip name="instrument-cast-info" title={t('UPLOADER_HOWTOCAST_DESC')} />
                </div>
            )}
            <Dialog
                open={openInstrumentationConfirmationModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: 'rounded-lg' }}
            >
                <div className="p-24 rounded-full">
                    <DialogTitle id="alert-dialog-title" className="text-center font-bold text-xl">
                        {t('CAST_WARNING_HL')}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" className="text-center">
                            {t('CAST_WARNING_TEXT')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="flex items-center justify-center">
                        {props.isMobile || (
                            <div className="flex items-center justify-center">
                                <Button
                                    onClick={handleClose}
                                    style={{ textTransform: 'none' }}
                                    className="flex items-left justify-center bg-grey-200 rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4"
                                >
                                    {t('CAST_WARNING_CANCEL')}
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    style={{ textTransform: 'none' }}
                                    className="flex items-center justify-center bg-grey-200 rounded-lg font-semibold text-lg pl-24 pr-24 mr-4 ml-4"
                                >
                                    {t('CAST_WARNING_CONFIRM')}
                                </Button>
                            </div>
                        )}
                        {props.isMobile && (
                            <div className="flex flex-col items-center">
                                <Button
                                    onClick={handleConfirm}
                                    style={{ textTransform: 'none' }}
                                    className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg w-full text-center p-8 pl-24 pr-24"
                                >
                                    {t('CAST_WARNING_CONFIRM')}
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    style={{ textTransform: 'none' }}
                                    className="items-center justify-center bg-gray-200 rounded-lg font-semibold text-lg w-full text-center mt-12 p-8 pl-24 pr-24"
                                >
                                    {t('CAST_WARNING_CANCEL')}
                                </Button>
                            </div>
                        )}
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
};

export default InstrumentCastSelector;
