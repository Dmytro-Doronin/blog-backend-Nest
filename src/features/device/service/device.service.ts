import {Injectable} from "@nestjs/common";
import {Device} from "../domain/device.entity";
import {DeviceRepository} from "../repositories/device.repository";
import {CustomJwtService} from "../../../common/jwt-module/service/jwt.service";


@Injectable()
export class DeviceService {

    constructor(
        private deviceRepository: DeviceRepository,
        private jwtService: CustomJwtService
    ) {}

    async createDevice (token: string, ip: string = 'No ip', title: string = 'No title') {
        // const {userId, lastActiveDate, expireDate, deviceId} = await this.jwtService.verify(token)
        const {sub, lastActiveDate, expireDate, deviceId} = this.jwtService.verifyRefreshToken(token)
        const newDevice =  Device.create(
            lastActiveDate,
            expireDate,
            deviceId,
            ip,
            title,
            sub
        )

        return await this.deviceRepository.createDevice(newDevice)
    }

    async changeDevicesData (token: string) {

        const {deviceId, lastActiveDate, expireDate} = await this.jwtService.verifyRefreshToken(token)
        console.log('deviceId,', deviceId, 'lastActiveDate,', lastActiveDate, 'expireDate,', expireDate)
        return await this.deviceRepository.changeDeviceDataByDeviceId(deviceId, lastActiveDate, expireDate)
    }

    async deleteDevice (deviceId: string) {
        return await this.deviceRepository.deleteDeviceByDeviceId(deviceId)
    }

    async deleteAllDeviceExcludeCurrent (deviceId: string) {
        return await this.deviceRepository.deleteAllDeviceExcludeCurrent(deviceId)
    }


}