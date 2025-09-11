import { useContext } from 'react';
import { AppContext } from '../context/AuthContext';

export const useAppContext = () => {
    return useContext(AppContext);
};