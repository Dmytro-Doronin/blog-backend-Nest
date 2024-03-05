import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
    @Prop({required: true})
    lastActiveDate: Date;

    @Prop({required: true })
    expireDate: Date;

    @Prop({required: true})
    deviceId: string;

    @Prop({required: true})
    ip: string

    @Prop({ required: true})
    title: string

    @Prop({required: true})
    userId: string


    static create(
        lastActiveDate: Date,
        expireDate: Date,
        deviceId: string,
        ip: string,
        title: string,
        userId: string,
    ) {
        const device = new Device();
        device.lastActiveDate = lastActiveDate
        device.expireDate = expireDate
        device.deviceId = deviceId
        device.ip = ip
        device.title = title
        device.userId = userId
        return device;
    }
}

export const DeviceSchema = SchemaFactory.createForClass(Device);