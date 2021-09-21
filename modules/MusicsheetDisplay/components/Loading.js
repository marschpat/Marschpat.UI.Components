import React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';

const Loading = ({ errorMsg }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <FuseLoading />
        </div>
    );
};

export default Loading;
