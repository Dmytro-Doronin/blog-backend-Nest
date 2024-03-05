import {MongooseModule} from "@nestjs/mongoose";
import {Device, DeviceSchema} from "./domain/device.entity";
import {Module} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";


@Module({
    imports: [MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }])],
    controllers: [],
    providers: [JwtService],
    exports: []
})

export class DeviceModule {}