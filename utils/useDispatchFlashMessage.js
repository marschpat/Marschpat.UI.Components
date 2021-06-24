import { useDispatch } from 'react-redux';
// import { enqueueSnackbar } from 'app/store/actions';

const useDispatchFlashMessage = () => {
    const dispatch = useDispatch();
    const dispatchFlashMessage = (message, variant = 'error') => {
        // dispatch(enqueueSnackbar({ message, options: {variant} }));
    }

    return dispatchFlashMessage;
}

export default useDispatchFlashMessage;
