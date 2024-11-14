const MAX_CAPACITY = 100;
const SAFE_CAPACITY = 92;
const DEVICE_MAX_CAPACITY = 40;

const devices = [];
const devicePower = new Map();

let totalPower = 0;

function allocatePower(deviceId, requestedPower) {
    const powerToAllocate = Math.min(requestedPower, DEVICE_MAX_CAPACITY, SAFE_CAPACITY - totalPower);
    devicePower.set(deviceId, powerToAllocate);
    totalPower += powerToAllocate;
    devices.push(deviceId);
}

function deviceConnect(deviceId, requestedPower) {
    if (devicePower.has(deviceId)) return;
    allocatePower(deviceId, requestedPower);
}

function deviceDisconnect(deviceId) {
    if (!devicePower.has(deviceId)) return;
    totalPower -= devicePower.get(deviceId);
    devicePower.delete(deviceId);
    const index = devices.indexOf(deviceId);
    if (index !== -1) devices.splice(index, 1);
    redistributePower();
}

function deviceChangeConsumption(deviceId, newRequestedPower) {
    if (!devicePower.has(deviceId)) return;
    totalPower -= devicePower.get(deviceId);
    allocatePower(deviceId, newRequestedPower);
    redistributePower();
}

function redistributePower() {
    let availablePower = SAFE_CAPACITY - totalPower;
    for (const deviceId of devices) {
        if (availablePower <= 0) break;
        const requestedPower = Math.min(DEVICE_MAX_CAPACITY, availablePower);
        const currentPower = devicePower.get(deviceId);
        if (currentPower < requestedPower) {
            const powerIncrease = requestedPower - currentPower;
            devicePower.set(deviceId, currentPower + powerIncrease);
            totalPower += powerIncrease;
            availablePower -= powerIncrease;
        }
    }
}

deviceConnect("A", 40);
deviceConnect("B", 40);
deviceConnect("C", 40);
deviceChangeConsumption("A", 20);
deviceDisconnect("B");
