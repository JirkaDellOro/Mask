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
        getTexture(_ptg: any): ƒ.TextureCanvas;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        private static mesh;
        private ptg;
        texture: Texture;
        constructor(_position: ƒ.Vector2);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let ptg: any;
    let graphTile: ƒ.Graph;
    let octopus: Octopus;
    function setupGenerator(): any;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Octopus {
        private node;
        coat: ƒ.CoatTextured;
        texture: Texture;
        constructor(_node: ƒ.Node);
        moveTo(_position: ƒ.Vector2): void;
        setTexture: () => void;
        stretch(_to: ƒ.Vector2): void;
        get position(): ƒ.Vector2;
        set position(_position: ƒ.Vector2);
    }
}
