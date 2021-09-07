import React from 'react';

const InputErrorMessage = props => {
    return props.condition ? (
        <div className="text-12 mt-4 ml-4 text-red-500">{props.msg}</div>
    ) : (
        ''
    );
};

export default InputErrorMessage;
