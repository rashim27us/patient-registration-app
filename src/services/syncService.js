import { EventEmitter } from 'events';

const syncEmitter = new EventEmitter();

const syncData = (data) => {
    localStorage.setItem('patientData', JSON.stringify(data));
    syncEmitter.emit('dataChanged', data);
};

const getData = () => {
    const data = localStorage.getItem('patientData');
    return data ? JSON.parse(data) : [];
};

const listenForChanges = (callback) => {
    syncEmitter.on('dataChanged', callback);
};

const notifyOtherTabs = () => {
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'patientData',
        newValue: JSON.stringify(getData()),
    }));
};

window.addEventListener('storage', (event) => {
    if (event.key === 'patientData') {
        syncEmitter.emit('dataChanged', JSON.parse(event.newValue));
    }
});

export { syncData, getData, listenForChanges, notifyOtherTabs };