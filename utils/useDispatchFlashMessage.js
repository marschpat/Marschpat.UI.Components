import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'app/store/fuse/notificationSlice';

/**
 * @ToDo: For future usage in various projects we will accept `enqueSnackbar` as argument
 * instead of importing it directly. This way the util can be used with
 * different types of "store" logic.
 *
 * @returns function
 */
const useDispatchFlashMessage = () => {
    const dispatch = useDispatch();
    const dispatchFlashMessage = (message, variant = 'error') => {
        dispatch(enqueueSnackbar({ message, options: {variant} }));
    }

    return dispatchFlashMessage;
}

export default useDispatchFlashMessage;
