import sampleUrl from "./assets/sample.png";

export const manifest = {
    preload: {
        sprites: [
            {
                name: "sample",
                path: sampleUrl,
                frames: [
                    {
                        height: 72,
                        width: 49,
                        x: 0,
                        y: 0
                    }
                ]
            }
        ]
    }
};

type SpriteFrameManifest = {
    height: number;
    width: number;
    x: number;
    y: number;
};

type SpriteSheetManifest = {
    name: string;
    path: string;
    frames: SpriteFrameManifest[];
};

export type Manifest = {
    preload: {
        sprites: SpriteSheetManifest[];
    };
};
