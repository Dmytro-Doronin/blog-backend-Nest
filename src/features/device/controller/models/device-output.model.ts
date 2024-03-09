import {Device, DeviceDocument} from "../../domain/device.entity";


export class DeviceOutputModel {
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string
}

export const deviceMapper = (device: DeviceDocument): DeviceOutputModel => {
    const newDevice = new DeviceOutputModel()

    newDevice.ip = device.ip
    newDevice.title = device.title
    newDevice.lastActiveDate = device.lastActiveDate
    newDevice.deviceId = device.deviceId

    return newDevice
}