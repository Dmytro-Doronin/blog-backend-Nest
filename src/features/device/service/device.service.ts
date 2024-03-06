import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Device} from "../domain/device.entity";
import {DeviceRepository} from "../repositories/device.repository";


@Injectable()
export class DeviceService {

    constructor(
        private jwtService: JwtService,
        private deviceRepository: DeviceRepository
    ) {}

    async createDevice (token: string, ip: string = 'No ip', title: string = 'No title') {
        const {userId, lastActiveDate, expireDate, deviceId} = await this.jwtService.verify(token)

        const newDevice =  Device.create(
            lastActiveDate,
            expireDate,
            deviceId,
            ip,
            title,
            userId
        )

        return await this.deviceRepository.createDevice(newDevice)
    }

}