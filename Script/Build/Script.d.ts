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
        #private;
        tint: ƒ.Color;
        amplitude: number;
        octaves: number;
        constructor();
        randomize(): void;
        getTexture(): ƒ.TextureCanvas;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        private static mesh;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let ptg: any;
    let graphTile: ƒ.Graph;
}
