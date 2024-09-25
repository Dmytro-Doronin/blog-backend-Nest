import {InjectModel} from "@nestjs/mongoose";
import {Device} from "../domain/device.entity";
import {Model} from "mongoose";

export class DeviceRepository {

    constructor(@InjectModel(Device.name) private DeviceModel: Model<Device> ) {}

    async createDevice (device: Device) {
        try {
            await this.DeviceModel.create(device)
            const result = await this.DeviceModel.findOne({lastActiveDate: device.lastActiveDate}).lean()
            if (!result) {
                return null
            }
            return result
        } catch (e) {
            throw new Error('Device was not created')
        }
    }

    async changeDeviceDataByDeviceId (deviceId: string, lastActiveDate: Date, expireDate: Date) {
        try {

            const deviceInDb = await this.DeviceModel.findOne({deviceId}).lean()
            console.log('deviceInDb', deviceInDb)
            if (!deviceInDb) {
                return null
            }

            const result = await this.DeviceModel.updateOne(
                {deviceId},
                {$set: {lastActiveDate, expireDate}}
            )

            return result.modifiedCount === 1
        } catch (e) {
            throw new Error('Can not update device')
        }
    }

    async deleteDeviceByDeviceId (deviceId: string) {
        try {
            const result = await this.DeviceModel.deleteOne({deviceId: deviceId})

            return result.deletedCount === 1
        } catch (e) {
            throw new Error('Can not delete device by deviceId')
        }
    }

    async deleteAllDeviceExcludeCurrent (deviceId: string) {
        try {

            await this.DeviceModel.deleteMany({deviceId: {$ne: deviceId}})

            const count = await this.DeviceModel.countDocuments({})

            return count === 1;

        } catch (e) {
            throw new Error('Can not delete devices')
        }
    }
}