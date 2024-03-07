import {MongooseModule} from "@nestjs/mongoose";
import {Device, DeviceSchema} from "./domain/device.entity";
import {Module} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {DeviceRepository} from "./repositories/device.repository";
import {DeviceService} from "./service/device.service";
import {CustomJwtModule} from "../../common/jwt-module/jwt.module";


@Module({
    imports: [MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]), CustomJwtModule],
    controllers: [],
    providers: [JwtService, DeviceRepository, DeviceService],
    exports: [DeviceService]
})

export class DeviceModule {}