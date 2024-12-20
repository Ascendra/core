import { Manifest } from "../manifest";
import { GlobalOutboundEventType } from "../models/GlobalOutboundEventType";
import { WorkerApi } from "../utility/Worker";

export enum AssetManagerInboundMessageType {
    Init,
    GetSprite
}

export enum AssetManagerOutboundMessageType {
    InvalidSpriteSheetPath,
    InvalidSpriteName,
    InvalidGetSpritePayload,
    InitFinished,
    GetSpriteResponse
}

type GetSpritePayload = {
    name: string;
    transactionId: string;
};

class AssetManager extends WorkerApi<
    AssetManagerInboundMessageType,
    AssetManagerOutboundMessageType
> {
    private assets = {
        sprites: new Map<string, ImageBitmap[]>()
    };

    protected async handleEvent(
        type: AssetManagerInboundMessageType,
        payload: any
    ): Promise<void> {
        switch (type) {
            case AssetManagerInboundMessageType.Init:
                await this.initialize(payload);
                break;
            case AssetManagerInboundMessageType.GetSprite:
                await this.getSprite(payload);
                break;
            default:
                this.respond(GlobalOutboundEventType.UnexpectedInboundEvent);
        }
    }

    private async initialize(manifest: Manifest): Promise<void> {
        const preloadedAssets: Promise<void>[] = [];

        manifest.preload.sprites.forEach(({ name, path, frames }) => {
            preloadedAssets.push(
                new Promise(async (resolve) => {
                    try {
                        const response = await fetch(path);
                        const spriteSheet = await response.blob();

                        const bitmaps = frames.map(
                            ({ x, y, height, width }) => {
                                return createImageBitmap(
                                    spriteSheet,
                                    x,
                                    y,
                                    width,
                                    height
                                );
                            }
                        );

                        const loadedBitmaps = await Promise.all(bitmaps);
                        this.assets.sprites.set(name, loadedBitmaps);
                        resolve();
                    } catch (e) {
                        console.log(e);
                        this.respond(
                            AssetManagerOutboundMessageType
                                .InvalidSpriteSheetPath,
                            path
                        );
                        resolve();
                    }
                })
            );
        });

        await Promise.all(preloadedAssets);

        this.respond(AssetManagerOutboundMessageType.InitFinished);
    }

    private async getSprite(payload: unknown): Promise<void> {
        if (!this.isWellFormedGetSpritePayload(payload)) {
            this.respond(
                AssetManagerOutboundMessageType.InvalidGetSpritePayload
            );
            return;
        }

        const { name, transactionId } = payload;

        const bitmaps = this.assets.sprites.get(name);
        if (bitmaps === undefined) {
            this.respond(
                AssetManagerOutboundMessageType.InvalidSpriteName,
                name
            );
            return;
        }

        this.respond(AssetManagerOutboundMessageType.GetSpriteResponse, {
            transactionId,
            bitmaps
        });
    }

    private isWellFormedGetSpritePayload(
        payload: unknown
    ): payload is GetSpritePayload {
        return typeof payload === "object" && payload !== null
            && "name" in payload && "transactionId" in payload;
    }
}

new AssetManager();
