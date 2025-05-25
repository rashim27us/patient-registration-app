import React, { useEffect, useState } from 'react';
import { listenForChanges } from '../services/syncService';

const SyncStatus = () => {
    const [status, setStatus] = useState('Synchronized');

    useEffect(() => {
        let isMounted = true;
        const handleSyncChange = () => {
            if (isMounted) {
                setStatus('Synchronized');
                // setStatus('Synchronizing...');
                // setTimeout(() => {
                //     if (isMounted) setStatus('Synchronized');
                // }, 1000);
            }
        };

        listenForChanges(handleSyncChange);

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="sync-status">
            <p>Synchronization Status: {status}</p>
        </div>
    );
};

export default SyncStatus;