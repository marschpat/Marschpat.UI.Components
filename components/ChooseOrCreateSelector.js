import React, { useState, useEffect } from 'react';
import axios from 'axios';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
const locale = {
    de: { CHOOSE: 'auswählen', CREATE: 'oder eingeben' },
    en: { CHOOSE: 'select', CREATE: 'or create' },
};
i18next.addResourceBundle('de', 'selector', locale.de);
i18next.addResourceBundle('en', 'selector', locale.en);

const ChooseOrCreateSelector = props => {
    const { t } = useTranslation(['selector']);
    const [selected, setSelected] = useState(null);
    const [options, setOptions] = useState([]);
    const handleChange = newSelected => {
        setSelected(newSelected);
        if (props.isMulti) {
            props.handleSelectedChange(
                newSelected.map(item => ({
                    id: item.value !== item.label ? item.value : 0,
                    name: item.label,
                }))
            );
            return;
        }

        props.handleSelectedChange({
            id: newSelected.value !== newSelected.label ? newSelected.value : 0,
            name: newSelected.label,
        });
    };

    // only fetch options if fetchOptionsUrl is provided
    useEffect(() => {
        if (props.fetchOptionsUrl) {
            axios
                .get(props.fetchOptionsUrl)
                .then(response => {
                    const fetchOptions = response.data?.map(item => ({
                        value: item.id,
                        label: item[props.labelAttr],
                    }));
                    setOptions(fetchOptions);
                })
                .catch(error => {
                    console.error(
                        `Fetching options from GET ${props.fetchOptionsUrl} failed with an error.`,
                        error
                    );
                });
        }
    }, []);

    // set initial values
    useEffect(() => {
        // set custom option if provided
        if (options && props.initialValue === 0 && props.initialCustomOption) {
            setSelected({ value: 999999, label: props.initialCustomOption });
        }

        // set non-custom option
        if (options && props.initialValue) {
            const initialItem = options.find(item => item.value === props.initialValue);
            setSelected(initialItem);
        }
    }, [options, props.initialValue, props.initialCustomOption]);

    useEffect(() => {
        if (props.options && props.options.length > 0) {
            setOptions(props.options);
        }
    }, [props.options]);

    useEffect(() => {
        if (props.resetState) {
            setSelected(null);
        }
    }, [props.resetState]);

    return (
        <FuseChipSelect
            value={selected}
            options={options}
            onChange={handleChange}
            className="max-w-512 w-full mt-20 mr-36"
            placeholder={`${props.label} ` + t('CHOOSE') + (props.isFixed ? '' : ' ' + t('CREATE'))}
            error={false}
            textFieldProps={{
                label: props.label,
                InputLabelProps: { shrink: true },
                variant: 'outlined',
            }}
            isMulti={props.isMulti ? true : false}
            variant={props.isFixed ? 'fixed' : ''}
            id={props.label ? props.label.toLowerCase() : Math.random()}
        />
    );
};

export default ChooseOrCreateSelector;
