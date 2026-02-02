declare namespace Script {
    import ƒ = FudgeCore;
    class Texture extends ƒ.Mutable {
        #private;
        normTint: number;
        normAmplitude: number;
        normOctaves: number;
        tint: ƒ.Color;
        amplitude: number;
        octaves: number;
        ptg: any;
        constructor();
        private setupGenerator;
        randomize(): void;
        setNormTint(_value: number): void;
        setNormAmplitude(_value: number): void;
        setNormOctaves(_value: number): void;
        setTexture(_texture: Texture): void;
        getTexture(): ƒ.TextureCanvas;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        private static mesh;
        texture: Texture;
        constructor(_position: ƒ.Vector2);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let ptg: any;
    let graphTile: ƒ.Graph;
    let octopus: Octopus;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Octopus {
        private node;
        private tentacle;
        coat: ƒ.CoatTextured;
        texture: Texture;
        coatTentacle: ƒ.CoatTextured;
        textureTentacle: Texture;
        constructor(_node: ƒ.Node);
        moveTo(_position: ƒ.Vector2): void;
        grope(_direction: number): void;
        setTexture: () => void;
        turn(_to: ƒ.Vector2): boolean;
        get position(): ƒ.Vector2;
        set position(_position: ƒ.Vector2);
    }
}
