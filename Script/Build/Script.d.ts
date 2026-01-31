declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Texture extends ƒ.Mutable {
        tint: ƒ.Color;
        density: number;
        amplitude: number;
        persistence: number;
        octaves: number;
        step: number;
        constructor();
        getTexture(): ƒ.TextureCanvas;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    let ptg: any;
}
