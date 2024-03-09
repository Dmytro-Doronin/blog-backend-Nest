import {MongooseModule} from "@nestjs/mongoose";
import {Device, DeviceSchema} from "./domain/device.entity";
import {Module} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {DeviceRepository} from "./repositories/device.repository";
import {DeviceService} from "./service/device.service";
import {CustomJwtModule} from "../../common/jwt-module/jwt.module";
import {DeviceQueryRepository} from "./repositories/device-query.repository";
import {DeviceController} from "./controller/device.controller";


@Module({
    imports: [MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]), CustomJwtModule],
    controllers: [DeviceController],
    providers: [DeviceRepository, DeviceService, DeviceQueryRepository],
    exports: [DeviceService, DeviceQueryRepository]
})

export class DeviceModule {}