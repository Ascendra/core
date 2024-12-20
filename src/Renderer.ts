import { Manifest } from "./manifest";
import {
    AssetManagerInboundMessageType,
    AssetManagerOutboundMessageType
} from "./workers/AssetManager";

type RendererOptions = {
    manifest: Manifest;
};

export class Renderer {
    private canvas = document.querySelector("canvas")!;
    private context = this.canvas.getContext("2d")!;

    constructor({ manifest }: RendererOptions) {
        const assetManager = new Worker(
            new URL("workers/AssetManager.ts", import.meta.url),
            { type: "module" }
        );

        assetManager.addEventListener("message", ({ data }) => {
            console.log(data);
            if (data.type === AssetManagerOutboundMessageType.InitFinished) {
                assetManager.postMessage({
                    type: AssetManagerInboundMessageType.GetSprite,
                    payload: {
                        name: "sample",
                        transactionId: "1"
                    }
                });
            }

            if (
                data.type === AssetManagerOutboundMessageType.GetSpriteResponse
            ) {
                this.context.drawImage(data.payload.bitmaps[0], 0, 0);
            }
        });

        assetManager.postMessage({
            type: AssetManagerInboundMessageType.Init,
            payload: manifest
        });
    }
}
