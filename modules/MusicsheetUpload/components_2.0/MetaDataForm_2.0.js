import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import EmbedVideo from '../components/index/EmbedVideo';
import TagSelector from '../components/index/TagSelector';
import BrowserSupportNote from '../components/index/BrowserSupportNote';
import InstrumentCastSelector from '../components/index/InstrumentCastSelector';
import { UploaderContext } from '../context/UploaderContext';
import useValidationErrors from '../utils/useValidationErrors';
import TextInput from '@marschpat/Marschpat.UI.Components/components/TextInput';
import { MP_EDU } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import CloseButton from '../utils_2.0/CloseButton';
import CollapseButton from '../utils_2.0/CollapseButton';

const initialMetaData = require('../metaData.initial.json');

const MetaDataForm = props => {
    const { t } = useTranslation(['uploader']); // used | used for translation | scope Global
    const { implementationMode, selectedMusicPieceIndex, isMobile, isMetadataVisible } =
        useContext(UploaderContext);
    const [personOptions, setPersonOptions] = useState(null);
    const [metaData, setMetaData] = useState(props.initialMetaData);
    const [selectedCast, setSelectedCast] = useState(props.selectedCast); // [castId, castName]
    const [resetSelectedCast, setResetSelectedCast] = useState(false); // [castId, castName
    const [isOptionalVisible, setIsOptionalVisible] = useState(false);
    const [errors, checkIfError, validateRequiredFields, resetErrors] = useValidationErrors(
        t,
        implementationMode
    );

    // TEST PURPOSES ONLY START (feature VoiceEditor
    const handleVoiceEditorOpenlick = () => {
        if (!props.selectedCast) {
            props.onVoiceEditorOpenlick(null);
            return;
        }

        let castToEdit = {
            name: props.selectedCast.name,
            instruments: [],
        };

        props.selectedCast.groups.forEach(group => {
            let groupToPush = {
                name: group.name,
                voices: [],
            };
            if (!group.instruments) return;
            group.instruments.forEach(instrument => {
                if (!instrument.voices) return;
                instrument.voices.forEach(voice => {
                    groupToPush.voices.push(voice);
                });
            });
            castToEdit.instruments.push(groupToPush);
        });

        props.onVoiceEditorOpenlick(castToEdit);
    };
    // TEST PURPOSES ONLY END (feature VoiceEditor)

    const handleMetadataCloseClick = () => {
        props.onMetadataCloseClick();
    };

    const handleExpandStateChange = newState => {
        setIsOptionalVisible(newState);
    };

    const getDisplayFilename = () => {
        if (isMobile) {
            if (metaData.title.length > 16) return metaData.title.slice(0, 16) + '...';
            else return metaData.title;
        }

        if (metaData.title.length > 22) return metaData.title.slice(0, 22) + '...';
        else return metaData.title;
    };

    useEffect(() => {
        fetchPersonOptions();
        resetErrors();
        validateRequiredFields(metaData);
    }, []);

    // Handle metaData change
    useEffect(() => {
        if (metaData != null) {
            resetErrors();
            validateRequiredFields(metaData);
            props.handleMetaDataUpdate(metaData, selectedMusicPieceIndex);
        }
    }, [metaData]);

    useEffect(() => {
        setMetaData({ ...props.initialMetaData });
        setSelectedCast({ ...props.selectedCast });
        setResetSelectedCast(true);
    }, [selectedMusicPieceIndex]);
    // Update errors    // triggers an infite render loop when errors thrown
    // useEffect(() => {
    //     if (errors != null) {
    //        props.handleErrorsUpdate(errors, selectedMusicPieceIndex);
    //     }
    // }, [errors]);

    // Reset MetaDataForm back to initial state
    useEffect(() => {
        if (props.resetState) {
            setMetaData(initialMetaData);
        }
    }, [props.resetState]);

    return (
        <section className="block w-full p-6 ml-6 bg-gray-200  border border-gray-200 shadow pb-24">
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 flex items-center pb-24">
                    <CloseButton onClick={handleMetadataCloseClick} />
                </div>
                <div className="mx-auto text-center pt-24 pb-12">
                    <Typography variant="h4" className="font-bold">
                        {t('META_HL')}
                    </Typography>
                    <p className="text-gray-700 text-xl pb-4">
                        {metaData
                            ? metaData.title
                                ? getDisplayFilename()
                                : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')
                            : t('UPLOADER_MUSICPIECESUPLOADED_DEFAULT_NAME')}
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap pl-24">
                <TextInput
                    title={t('META_TITLE')}
                    name="title"
                    value={metaData?.title ?? ''}
                    onChange={event => setMetaData({ ...metaData, title: event.target.value })}
                    required={true}
                    autoFocus={true}
                    error={checkIfError('title')}
                />

                {/* NO CastSelector option only in Marschpat Edu WebApp available */}
                {implementationMode !== MP_EDU && (
                    <div className="flex flex-wrap items-center w-full h-full">
                        <InstrumentCastSelector
                            castOptions={props.castOptions}
                            initialCast={selectedCast}
                            handleCastChange={handleCastChange}
                            handleVoicesAssignementReset={props.handleVoicesAssignementReset}
                            castWarningRequired={props.castWarningRequired}
                            resetState={resetSelectedCast}
                            error={checkIfError('cast')}
                            isMobile={isMobile}
                        />
                        <button
                            className="text-blue-300 bg-transparent border-none focus:outline-none focus:ring-0 mt-8 text-mg ml-4"
                            onClick={() => handleVoiceEditorOpenlick()}
                        >
                            VoiceEditor
                        </button>
                    </div>
                )}
                <div className="flex flex-wrap items-center">
                    <div className="text-black text-lg pt-24 font-bold">
                        {t('META_TITLE_OPTIONAl')}
                    </div>
                    <div className="pt-24">
                        <CollapseButton
                            isExpanded={isOptionalVisible}
                            onStateChange={handleExpandStateChange}
                        />
                    </div>
                </div>
                <div
                    style={{
                        visibility: isOptionalVisible && isMetadataVisible ? 'visible' : 'hidden',
                    }}
                    className="flex flex-wrap"
                >
                    <ChooseOrCreateSelector
                        label={t('PUBLISHER')}
                        labelAttr="name"
                        fetchOptionsUrl="/publisher?publisherUnderLicenseOnly=true"
                        initialValue={metaData?.publisherId ?? ''}
                        initialCustomOption={metaData?.publisher ?? {}}
                        resetState={props.resetState}
                        handleSelectedChange={item => handleChooseOrCreateChange('publisher', item)}
                    />
                    <ChooseOrCreateSelector
                        label={t('COMPOSER')}
                        options={personOptions}
                        resetState={props.resetState}
                        initialValue={metaData?.composerId ?? ''}
                        initialCustomOption={metaData?.composer ?? {}}
                        handleSelectedChange={item => handleChooseOrCreateChange('composer', item)}
                    />
                    <ChooseOrCreateSelector
                        label={t('ARRANGER')}
                        options={personOptions}
                        resetState={props.resetState}
                        initialValue={metaData?.arrangerId ?? ''}
                        initialCustomOption={metaData?.arranger ?? {}}
                        handleSelectedChange={item => handleChooseOrCreateChange('arranger', item)}
                    />
                    <TagSelector
                        initialTags={metaData?.tags ?? ''}
                        resetState={props.resetState}
                        handleTagsChange={handleTagsChange}
                    />
                    <TextInput
                        label={t('COPYRIGHT')}
                        name="copyright"
                        value={metaData?.copyright ?? ''}
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
                        value={metaData?.iswc ?? ''}
                        onChange={event => setMetaData({ ...metaData, iswc: event.target.value })}
                        error={false}
                    />
                    <TextInput
                        label={t('SUBTITLE')}
                        name="subtitle"
                        value={metaData?.subtitle ?? ''}
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
        props.handleCastChange(selectedCast, selectedMusicPieceIndex);
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
};

export default MetaDataForm;
