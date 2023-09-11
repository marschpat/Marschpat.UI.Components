import React from 'react';
import InputErrorMessage from '@marschpat/Marschpat.UI.Components/components/InputErrorMessage';
import TextField from '@material-ui/core/TextField';

const TextInput = props => {
    const error = props.error;
    const showError = props.error ? true : false;

    return (
        <div className="max-w-512 w-full mt-20 mr-36">
            {props.title && <p className="text-gray-700 text-xl pb-4">{props.title}</p>}
            <TextField className="bg-white"
                type="text"
                label={props.label}
                id={props.name}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                variant="outlined"
                fullWidth
                error={showError}
                required={props.required ?? false}
                autoFocus={props.autoFocus ?? false}
            />
            <InputErrorMessage msg={error?.msg} condition={showError} />
        </div>
    );
};

export default TextInput;
