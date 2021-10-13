import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UploaderContext } from '../../context/UploaderContext';
import { apiRoutes } from '../../utils/ImplementationModesLookup';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

const TagSelector = props => {
    const { implementationMode } = useContext(UploaderContext);
    const [tagOptions, setTagOptions] = useState(null);
    const [selectedTags, setSelectedTags] = useState(null);
    const GET_tags = apiRoutes[implementationMode].musiclibrary;

    useEffect(() => {
        const request = axios
            .get(GET_tags)
            .then(response => {
                setTagOptions(mapTags(response.data));
            })
            .catch(error => {
                console.error(
                    'Fetching musiclibrary tags from GET /musiclibrary/tags failed with an error.',
                    error
                );
            });
    }, []);

    useEffect(() => {
        if (tagOptions && props.initialTags && !selectedTags) {
            const initialItems = props.initialTags.map(initTag =>
                tagOptions.find(item => item.value === initTag.tagId)
            );
            setSelectedTags(initialItems);
        }
    }, [tagOptions, props.initialTags]);

    useEffect(() => {
        props.handleTagsChange(selectedTags);
    }, [selectedTags]);

    useEffect(() => {
        if (props.resetState) {
            setSelectedTags(null);
        }
    }, [props.resetState]);

    return (
        <FuseChipSelect
            className="max-w-640 w-full mt-20 mr-36"
            value={selectedTags}
            onChange={value => setSelectedTags(value)}
            placeholder="Tag's zuordnen"
            textFieldProps={{
                label: 'Kategorie',
                InputLabelProps: {
                    shrink: true,
                },
                variant: 'outlined',
            }}
            options={tagOptions}
            error={false}
            isMulti
            variant="fixed"
            id="tags"
        />
    );

    function mapTags(tagItems) {
        return tagItems.map(item => ({
            value: item.tagId,
            label: item.name,
            ...item,
        }));
    }
};

export default TagSelector;
