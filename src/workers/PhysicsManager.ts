import { WorkerApi } from "../utility/Worker";

export enum PhysicsManagerInboundMessageType {
}

export enum PhysicsManagerOutboundMessageType {
}

class PhysicsManager extends WorkerApi<
    PhysicsManagerInboundMessageType,
    PhysicsManagerOutboundMessageType
> {
    protected async handleEvent(
        type: PhysicsManagerInboundMessageType,
        payload: any
    ): Promise<void> {
    }
}

new PhysicsManager();
