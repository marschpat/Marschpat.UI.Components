import React, { useState, useEffect } from 'react';
import TagSelector from './TagSelector';
import InstrumentCastSelector from './InstrumentCastSelector';
import useValidationErrors from '../../utils/useValidationErrors';
import TextInput from '@marschpat/Marschpat.UI.Components/components/TextInput';
import ChooseOrCreateSelector from '@marschpat/Marschpat.UI.Components/components/ChooseOrCreateSelector';
import { useDebounce } from '@fuse/hooks';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const initialMetaData = require('../../metaData.initial.json');

const MetaDataForm = props => {
    const [personOptions, setPersonOptions] = useState(null);
    const [metaData, setMetaData] = useState(initialMetaData);
    const [errors, checkIfError, validateRequiredFields] = useValidationErrors();
    const handleDebouncedMetaDataUpdate = useDebounce(metaData => {
        validateRequiredFields(metaData);
        props.handleMetaDataUpdate(metaData);
    }, 500);

    // Handle metaData change
    useEffect(() => {
        handleDebouncedMetaDataUpdate(metaData);
    }, [metaData])

    // Update errors
    useEffect(() => {
        props.handleUpdateErrors(errors);
    }, [errors])

    // Reset MetaDataForm back to initial state
    useEffect(() => {
        if (props.resetState) {
            setMetaData(initialMetaData);
        }
    }, [props.resetState])

    useEffect(() => {
        fetchPersonOptions();
    }, []);

    // initialize with downloaded edit data
    useEffect(() => {
        setInitialMetaData(props.initialMetaData);
    }, [props.initialMetaData]);

    return (
        <section>
            <Typography variant="h6" className="font-bold">Grunddaten des Musikstücks</Typography>
            <div className="flex flex-wrap pl-24">
                <TextInput
                    label="Titel des Musikstücks"
                    name="title"
                    value={metaData.title}
                    onChange={event => setMetaData({ ...metaData, title: event.target.value })}
                    required={true}
                    autoFocus={true}
                    error={checkIfError('title')}
                />
                <InstrumentCastSelector
                    castOptions={props.castOptions}
                    initialCast={metaData.castId}
                    handleCastChange={handleCastChange}
                    handleVoicesAssignementReset={props.handleVoicesAssignementReset}
                    castWarningRequired={props.castWarningRequired}
                    resetState={props.resetState}
                    error={checkIfError('cast')}
                />
                <ChooseOrCreateSelector
                    label='Verlag'
                    labelAttr='name'
                    fetchOptionsUrl='/publisher'
                    initialValue={metaData.publisherId}
                    initialCustomOption={metaData.publisher}
                    resetState={props.resetState}
                    handleSelectedChange={item => handleChooseOrCreateChange('publisher', item)}
                />
                <ChooseOrCreateSelector
                    label="Komponist"
                    options={personOptions}
                    resetState={props.resetState}
                    initialValue={metaData.composerId}
                    initialCustomOption={metaData.composer}
                    handleSelectedChange={item => handleChooseOrCreateChange('composer', item)}
                />
                <ChooseOrCreateSelector
                    label="Arrangeur"
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
                    label="Copyright"
                    name="copyright"
                    value={metaData.copyright}
                    onChange={event => setMetaData({ ...metaData, copyright: event.target.value })}
                    error={false}
                />
                <TextInput
                    label="ISWC Nummer"
                    name="iswc"
                    value={metaData.iswc}
                    onChange={event => setMetaData({ ...metaData, iswc: event.target.value })}
                    error={false}
                />
                <TextInput
                    label="Untertitel"
                    name="subtitle"
                    value={metaData.subtitle}
                    onChange={event => setMetaData({ ...metaData, subtitle: event.target.value })}
                    error={false}
                />
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
            tags: (tags && tags.length > 0) ? tags.map(tag => ({tagID: tag.tagID}) ) : tags,
        });
    }

    // @ToDo: See above... Look out for  a niceer solution to remove the "fetching" logic from here
    function fetchPersonOptions() {
        axios.get('/persons').then(response => {
            setPersonOptions(response.data?.map(item => ({ value: item.id, label: item.fullName })));
        }).catch(error => {
            console.error(`Fetching options from GET /persons failed with an error.`, error);
        });
    }

    function setInitialMetaData(metaData) {
        if (!metaData) return;
        setMetaData(metaData);
    }
}

export default MetaDataForm;
