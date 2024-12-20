import { GlobalOutboundEventType } from "../models/GlobalOutboundEventType";

type Message<WorkerEventTypes> = {
    type: WorkerEventTypes;
    payload: any;
};

export abstract class WorkerApi<InboundEventTypes, OutboundEventTypes> {
    constructor() {
        onmessage = this.parseRawMessage;
    }

    protected abstract handleEvent(type: InboundEventTypes, payload: any): void;

    protected respond(
        type: OutboundEventTypes | GlobalOutboundEventType,
        payload?: any
    ) {
        postMessage({
            type,
            payload
        });
    }

    private parseRawMessage = ({ data }: MessageEvent) => {
        if (!this.isWellFormedInboundEvent(data)) {
            this.respond(GlobalOutboundEventType.UnknownInboundEvent);
            return;
        }

        this.handleEvent(data.type, data.payload);
    };

    private isWellFormedInboundEvent = (
        eventData: unknown
    ): eventData is Message<InboundEventTypes> => {
        return typeof eventData === "object"
            && eventData !== null
            && "type" in eventData
            && "payload" in eventData;
    };
}
