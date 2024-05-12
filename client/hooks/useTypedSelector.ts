import { useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import { RootState } from '@/redux/reducers/index';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
