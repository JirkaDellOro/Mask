"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Texture extends ƒ.Mutable {
        #seed = ƒ.random.getNorm();
        #density;
        #persistence;
        constructor() {
            super();
            this.tint = new ƒ.Color(0, 1, 0, 1);
            this.amplitude = 1;
            this.#persistence = 0.5;
            this.octaves = 2;
            this.#density = 0.6;
        }
        randomize() {
            this.tint = ƒ.Color.CSS(`hsl(${ƒ.random.getRangeFloored(0, 360)}, 80%, 60%)`);
            this.#seed = ƒ.random.getNorm();
            this.octaves = ƒ.random.getRange(1, 4);
            this.amplitude = ƒ.random.getRange(0.5, 2 - this.octaves / 4);
            this.#persistence = 1; //ƒ.random.getRange(0, 1);
            this.#density = 0.5; // ƒ.random.getNorm();
        }
        getTexture(_ptg) {
            let data = {
                program: "cellularFractal",
                blendMode: "add",
                seed: this.#seed,
                tint: [this.tint.r, this.tint.g, this.tint.b],
                density: this.#density,
                amplitude: this.amplitude,
                persistence: this.#persistence,
                octaves: this.octaves,
                step: this.octaves
            };
            _ptg.set([data]);
            // let rim: number = 5;
            // for (let a: number=0; a<rim; a++) {
            //   _ptg.ctx.fillStyle = `rgba(255,255,255,${a/rim}`;
            //   _ptg.ctx.fillRect(a,a,ptg.ctx.canvas.width-a, _ptg.ctx.canvas.height-a);
            // }
            return new ƒ.TextureCanvas("test", _ptg.ctx);
        }
        reduceMutator(_mutator) {
        }
    }
    Script.Texture = Texture;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    // declare const PTG: any;
    class Tile extends ƒ.Node {
        static { this.mesh = new ƒ.MeshQuad("mshTile"); }
        constructor(_position) {
            super("Tile");
            this.ptg = Script.setupGenerator();
            this.addComponent(new ƒ.ComponentMesh(Tile.mesh));
            this.texture = new Script.Texture();
            this.texture.randomize();
            let coat = new ƒ.CoatTextured(new ƒ.Color(), this.texture.getTexture(this.ptg));
            let material = new ƒ.Material("mtrTile", ƒ.ShaderLitTextured, coat);
            this.addComponent(new ƒ.ComponentMaterial(material));
            this.addComponent(new ƒ.ComponentTransform);
            this.mtxLocal.translate(_position.toVector3());
        }
    }
    Script.Tile = Tile;
})(Script || (Script = {}));
/// <reference path="Texture.ts"/>;
/// <reference path="Tile.ts"/>;
var Script;
/// <reference path="Texture.ts"/>;
/// <reference path="Tile.ts"/>;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let coatOctopus;
    let txtOctopus = new Script.Texture();
    const tiles = {};
    function start(_event) {
        viewport = _event.detail;
        Script.graphTile = ƒ.Project.getResourcesByName("Tile")[0];
        viewport.camera.mtxPivot.translateZ(5);
        viewport.camera.mtxPivot.rotateY(180);
        Script.ptg = setupGenerator();
        setupFloor();
        setupOctopus();
        let domUI = ƒUi.Generator.createInterfaceFromMutable(txtOctopus);
        document.body.appendChild(domUI);
        new ƒUi.Controller(txtOctopus, domUI);
        txtOctopus.addEventListener("mutate" /* ƒ.EVENT.MUTATE */, setTexture);
        viewport.canvas.addEventListener("mousemove", hndMouseMove);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        ƒ.Time.game.setTimer(1000, 1, () => {
            txtOctopus.randomize();
            setTexture();
        });
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function hndMouseMove(_event) {
        let posClient = new ƒ.Vector2(_event.clientX, _event.clientY);
        let ray = viewport.getRayFromClient(posClient);
        let posWorld = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Z());
        let posGrid = new ƒ.Vector2(Math.round(posWorld.x), Math.round(posWorld.y));
        console.log(posGrid);
    }
    function setTexture() {
        coatOctopus.texture = txtOctopus.getTexture(Script.ptg);
    }
    function setupGenerator() {
        let canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        return new PTG.ProceduralTextureGenerator(canvas);
    }
    Script.setupGenerator = setupGenerator;
    function setupFloor() {
        for (let y = -2; y <= 2; y++)
            for (let x = -2; x <= 2; x++) {
                let posTile = new ƒ.Vector2(x, y);
                let tile = new Script.Tile(posTile);
                tiles[posTile.toString()] = tile;
                viewport.getBranch().addChild(tile);
            }
        console.log(tiles);
    }
    function setupOctopus() {
        let octopus = viewport.getBranch().getChildByName("Octopus");
        let cmpMaterial = octopus.getComponent(ƒ.ComponentMaterial);
        coatOctopus = cmpMaterial.material.coat;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map