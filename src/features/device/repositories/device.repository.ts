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
}