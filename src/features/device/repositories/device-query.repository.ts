import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Device} from "../domain/device.entity";
import {Model} from "mongoose";
import {deviceMapper} from "../controller/models/device-output.model";

@Injectable()
export class DeviceQueryRepository {

    constructor(@InjectModel(Device.name) private DeviceModel: Model<Device>) {}

    async getAllDevice (currentUserId: string) {
        try {
            const devices = await this.DeviceModel.find({userId: currentUserId})

            return devices.map(deviceMapper)
        } catch (e) {
            throw new Error('Can not get all data')
        }

    }

    async getDeviceById (deviceId: string) {
        try {
            const device = await this.DeviceModel.findOne(
                {deviceId:deviceId}
            ).lean()

            if (!device) {
                return false
            }

            return device

        } catch (e) {
            throw new Error('Can not find device')

        }
    }
}