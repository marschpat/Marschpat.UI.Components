import React from 'react';
import ErrorMessage from './ErrorMessage';
import TextField from '@material-ui/core/TextField';

const TextInput = props => {
    const error = props.error;
    const showError = props.error ? true : false;

    return (
        <div className="max-w-640 w-full mt-20 mr-36">
            <TextField
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
            <ErrorMessage msg={error?.msg} condition={showError}/>
        </div>
    );
}

function ErrorMessage(props) {
    return props.condition
        ? (<div className="text-12 mt-4 ml-4 text-red-500">{props.msg}</div>)
        : '';
}

export default TextInput;
