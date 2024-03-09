import {
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Request,
    Res,
    UseGuards
} from "@nestjs/common";
import {VerifyRefreshTokenGuard} from "../../../common/jwt-module/guards/verify-token.guard";
import {Response} from "express";
import {DeviceQueryRepository} from "../repositories/device-query.repository";
import {DeviceService} from "../service/device.service";


@Controller('/security/devices')

export class DeviceController {

    constructor(
        private readonly deviceQueryRepository: DeviceQueryRepository,
        private readonly deviceService: DeviceService
    ) {}

    @UseGuards(VerifyRefreshTokenGuard)
    @Get()
    async getAllDevice(
        @Request() req,
        @Res() res: Response,
    ) {
        const currentUserId = req.userId
        const devices = await this.deviceQueryRepository.getAllDevice(currentUserId)

        return res.status(200).send(devices)
    }

    @UseGuards(VerifyRefreshTokenGuard)
    @Delete()
    async deleteAllDevicesExcludeCurrent(
        @Request() req,
        @Res() res: Response,
    ) {
        const deviceId = req.deviceId

        const result = await this.deviceService.deleteAllDeviceExcludeCurrent(deviceId)

       if (!result) {
            throw new NotFoundException()
        }

        return res.sendStatus(204)
    }

    @UseGuards(VerifyRefreshTokenGuard)
    @Delete('/:deviceId')
    async deleteSpecifiedDevice (
        @Request() req,
        @Res() res: Response,
        @Param('deviceId')  deviceId: string
    ) {
        const userId = req.userId

        const device = await this.deviceQueryRepository.getDeviceById(deviceId)

        if (!device) {
            throw new NotFoundException()
        }

        if (userId !== device.userId) {
            throw new ForbiddenException()
        }

        const result = await this.deviceService.deleteDevice(deviceId)

        if (!result) {
            throw new NotFoundException()
        }

        return res.status(204)
    }
}