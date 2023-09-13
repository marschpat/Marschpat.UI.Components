import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import EmbedVideo from './EmbedVideo';
import TagSelector from './TagSelector';
import HelpModeButton from './HelpModeButton';
import BrowserSupportNote from './BrowserSupportNote';
import InstrumentCastSelector from './InstrumentCastSelector';
import { UploaderContext } from '../../context/UploaderContext';
import useValidationErrors from '../../utils/useValidationErrors';
import TextInput from '@marschpat/Marschpat.UI.Components/components/TextInput';
import { MP_EDU } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';
import { useDebounce } from '@fuse/hooks';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import CloseButton from '../../utils/CloseButton';
import CollapseButton from '../../utils/CollapseButton';

const initialMetaData = require('../../metaData.initial.json');

const MetaDataForm = props => {
    const { t } = useTranslation(['uploader']);
    const { implementationMode } = useContext(UploaderContext);
    const [personOptions, setPersonOptions] = useState(null);
    const [metaData, setMetaData] = useState(initialMetaData);
    const [isOptionalVisible, setIsOptionalVisible] = useState(false);
    const [errors, checkIfError, validateRequiredFields] = useValidationErrors(
        t,
        implementationMode
    );
    const handleDebouncedMetaDataUpdate = useDebounce(metaData => {
        validateRequiredFields(metaData);
        props.handleMetaDataUpdate(metaData);
        props.handleMetaDataUpdate(metaData);
    }, 500);

    const handleMetadataCloseClick = () => {
        props.onMetadataCloseClick();
    };

    const handleExpandStateChange = newState => {
        setIsOptionalVisible(newState);
    };

    // Handle metaData change
    useEffect(() => {
        handleDebouncedMetaDataUpdate(metaData);
    }, [metaData]);

    // Update errors    // triggers an infite render loop when errors thrown
    useEffect(() => {
        props.handleUpdateErrors(errors);
    }, [errors]);

    // Reset MetaDataForm back to initial state
    useEffect(() => {
        if (props.resetState) {
            setMetaData(initialMetaData);
        }
    }, [props.resetState]);

    useEffect(() => {
        fetchPersonOptions();
    }, []);

    // initialize with downloaded edit data
    useEffect(() => {
        setInitialMetaData(props.initialMetaData);
    }, [props.initialMetaData]);

    return (
        <section className="block w-full p-6 ml-6 bg-gray-200  border border-gray-200 shadow pb-24">
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 flex items-center pb-24">
                    <CloseButton onClick={handleMetadataCloseClick}/>
                </div>
                <div className="mx-auto text-center pt-24 pb-12">
                    <Typography variant="h4" className="font-bold">
                        {t('META_HL')}
                    </Typography>
                    <p className="text-gray-700 text-xl pb-4">{metaData ? metaData.title ? metaData.title : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME') : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')}</p>
                </div>
                <div className="flex space-x-4">
                    <BrowserSupportNote />
                    <EmbedVideo />
                </div>
            </div>
            <div className="flex flex-wrap pl-24">
                <TextInput
                    title={t('META_TITLE')}
                    name="title"
                    value={metaData.title}
                    onChange={event => setMetaData({ ...metaData, title: event.target.value })}
                    required={true}
                    autoFocus={true}
                    error={checkIfError('title')}
                />

                {/* NO CastSelector option only in Marschpat Edu WebApp available */}
                {implementationMode !== MP_EDU && (
                    <InstrumentCastSelector
                        castOptions={props.castOptions}
                        initialCast={metaData.castId}
                        handleCastChange={handleCastChange}
                        handleVoicesAssignementReset={props.handleVoicesAssignementReset}
                        castWarningRequired={props.castWarningRequired}
                        resetState={props.resetState}
                        error={checkIfError('cast')}
                        isMobile={props.isMobile}
                    />
                )}
                <div className="grid grid-cols-2">
                    <p className="text-black text-lg pt-24 font-bold">{t('META_TITLE_OPTIONAl')}</p>
                    <p className="pt-16">
                        <CollapseButton
                            isExpanded={isOptionalVisible} 
                            onStateChange={handleExpandStateChange}
                        />
                    </p>
                </div>
                <div style={{ visibility: isOptionalVisible && props.isVisible ? "visible" : "hidden" }} className="flex flex-wrap"> 
                    <ChooseOrCreateSelector
                        label={t('PUBLISHER')}
                        labelAttr="name"
                        fetchOptionsUrl="/publisher?publisherUnderLicenseOnly=true"
                        initialValue={metaData.publisherId}
                        initialCustomOption={metaData.publisher}
                        resetState={props.resetState}
                        handleSelectedChange={item => handleChooseOrCreateChange('publisher', item)}
                    />
                    <ChooseOrCreateSelector
                        label={t('COMPOSER')}
                        options={personOptions}
                        resetState={props.resetState}
                        initialValue={metaData.composerId}
                        initialCustomOption={metaData.composer}
                        handleSelectedChange={item => handleChooseOrCreateChange('composer', item)}
                    />
                    <ChooseOrCreateSelector
                        label={t('ARRANGER')}
                        options={personOptions}
                        resetState={props.resetState}
                        initialValue={metaData.arrangerId}
                        initialCustomOption={metaData.arranger}
                        handleSelectedChange={item => handleChooseOrCreateChange('arranger', item)}
                    />
                    <TagSelector
                        initialTags={metaData.tags}
                        resetState={props.resetState}
                        handleTagsChange={handleTagsChange}
                    />
                    <TextInput
                        label={t('COPYRIGHT')}
                        name="copyright"
                        value={metaData.copyright}
                        onChange={event =>
                            setMetaData({
                                ...metaData,
                                copyright: event.target.value,
                            })
                        }
                        error={false}
                    />
                    <TextInput
                        label={t('ISWC')}
                        name="iswc"
                        value={metaData.iswc}
                        onChange={event => setMetaData({ ...metaData, iswc: event.target.value })}
                        error={false}
                    />
                    <TextInput
                        label={t('SUBTITLE')}
                        name="subtitle"
                        value={metaData.subtitle}
                        onChange={event =>
                            setMetaData({
                                ...metaData,
                                subtitle: event.target.value,
                            })
                        }
                        error={false}
                    />
                </div>
            </div>
        </section>
    );

    /**
     * Set attribute and attribute id in metaData.
     * E.g.: publisher, publisherId
     */
    function handleChooseOrCreateChange(attrName, item) {
        setMetaData({
            ...metaData,
            [attrName]: item?.name,
            [`${attrName}Id`]: item?.id,
        });
    }

    /**
     * Set the castId in metaData.
     */
    function handleCastChange(selectedCast) {
        setMetaData({
            ...metaData,
            castId: selectedCast ? selectedCast.id : 0,
            castName: selectedCast ? selectedCast.name : '',
        });
        props.handleCastChange(selectedCast);
    }

    function handleTagsChange(tags) {
        setMetaData({
            ...metaData,
            tags:
                tags && tags.length > 0
                    ? tags.map(tag => {
                          if (tag) return { tagId: tag.tagId };
                      })
                    : tags,
        });
    }

    // @ToDo: See above... Look out for  a niceer solution to remove the "fetching" logic from here
    function fetchPersonOptions() {
        axios
            .get('/persons')
            .then(response => {
                setPersonOptions(
                    response.data?.map(item => ({
                        value: item.id,
                        label: item.fullName,
                    }))
                );
            })
            .catch(error => {
                console.error(`Fetching options from GET /persons failed with an error.`, error);
            });
    }

    function setInitialMetaData(metaData) {
        if (!metaData) return;
        setMetaData(metaData);
    }
};

export default MetaDataForm;
