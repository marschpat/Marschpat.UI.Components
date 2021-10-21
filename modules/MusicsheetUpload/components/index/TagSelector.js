import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import InfoTooltip from '../InfoTooltip';
import { UploaderContext } from '../../context/UploaderContext';
import { apiRoutes } from '@marschpat/Marschpat.UI.Components/utils/ImplementationModesLookup';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

const TagSelector = props => {
    const { implementationMode } = useContext(UploaderContext);
    const [tagOptions, setTagOptions] = useState(null);
    const [selectedTags, setSelectedTags] = useState(null);
    const GET_tags = apiRoutes[implementationMode].musiclibrary;
    const { inHelpMode } = useContext(UploaderContext);

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
                tagOptions.find(item => item.value === initTag.tagID)
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
        <div className="max-w-512 w-full mt-20 mr-36">
            <FuseChipSelect
                value={selectedTags}
                onChange={value => setSelectedTags(value)}
                placeholder="Tag's zuordnen"
                textFieldProps={{
                    label: 'Tags',
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
            {inHelpMode && (
                <div className="my-10 flex items-center justify-between">
                    <p className="text-base text-orange-300 font-bold">Wozu Tag's?</p>
                    <InfoTooltip
                        name="tag-info"
                        title="Tag's helfen dir Musikstücke zu kategorisieren und einfacher wiederzufinden"
                    />
                </div>
            )}
        </div>
    );

    function mapTags(tagItems) {
        return tagItems.map(item => ({
            value: item.tagID,
            label: item.name,
            ...item,
        }));
    }
};

export default TagSelector;
