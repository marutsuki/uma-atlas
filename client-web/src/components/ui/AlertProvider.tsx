import { alertSelector } from '@/store/slices/alert.slice';
import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const { alerts } = useSelector(alertSelector)

    return <>
        <div className='fixed w-screen top-0 flex flex-col gap-1'>
            {alerts.map(alert =>
                <div className='w-full rounded-lg bg-red-300 p-4 animate-alert-slidein'>{alert.message}</div>
            )}
        </div>
        {children}
    </>
};