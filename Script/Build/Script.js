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
            this.ptg = this.setupGenerator();
        }
        setupGenerator() {
            let canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            return new PTG.ProceduralTextureGenerator(canvas);
        }
        randomize() {
            this.tint = ƒ.Color.CSS(`hsl(${ƒ.random.getRangeFloored(0, 360)}, 80%, 60%)`);
            this.#seed = ƒ.random.getNorm();
            this.octaves = ƒ.random.getRange(1, 4);
            this.amplitude = ƒ.random.getRange(0.5, 2 - this.octaves / 4);
            this.#persistence = 1; //ƒ.random.getRange(0, 1);
            this.#density = 0.5; // ƒ.random.getNorm();
        }
        setNormTint(_value) {
            this.normTint = Math.min(0, Math.max(1, _value));
            this.tint = ƒ.Color.CSS(`hsl(${this.normTint * 360}, 80%, 60%)`);
        }
        setNormAmplitude(_value) {
            this.normAmplitude = Math.min(0, Math.max(1, _value));
            this.amplitude = 0.5 + _value * 6;
        }
        setNormOctaves(_value) {
            this.normOctaves = Math.min(0, Math.max(1, _value));
            this.octaves = 1 + _value * 5;
        }
        setTexture(_texture) {
            this.tint = _texture.tint.clone;
            this.octaves = _texture.octaves;
            this.amplitude = _texture.amplitude;
        }
        getTexture() {
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
            this.ptg.set([data]);
            // let rim: number = 5;
            // for (let a: number=0; a<rim; a++) {
            //   _ptg.ctx.fillStyle = `rgba(255,255,255,${a/rim}`;
            //   _ptg.ctx.fillRect(a,a,ptg.ctx.canvas.width-a, _ptg.ctx.canvas.height-a);
            // }
            return new ƒ.TextureCanvas("test", this.ptg.ctx);
        }
        reduceMutator(_mutator) {
        }
    }
    Script.Texture = Texture;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        static { this.mesh = new ƒ.MeshQuad("mshTile"); }
        constructor(_position) {
            super("Tile");
            this.addComponent(new ƒ.ComponentMesh(Tile.mesh));
            this.texture = new Script.Texture();
            this.texture.randomize();
            let coat = new ƒ.CoatTextured(new ƒ.Color(), this.texture.getTexture());
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
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    const tiles = {};
    let synth;
    function start(_event) {
        const audioContext = new AudioContext();
        synth = new OctoTexture(audioContext);
        synth.start();
        viewport = _event.detail;
        Script.graphTile = ƒ.Project.getResourcesByName("Tile")[0];
        viewport.camera.mtxPivot.translateZ(5);
        viewport.camera.mtxPivot.rotateY(180);
        setupFloor();
        Script.octopus = new Script.Octopus(viewport.getBranch().getChildByName("Octopus"));
        // let domUI: HTMLDivElement = ƒUi.Generator.createInterfaceFromMutable(octopus.textureTentacle);
        // document.body.appendChild(domUI);
        // new ƒUi.Controller(octopus.textureTentacle, domUI);
        // octopus.textureTentacle.addEventListener(ƒ.EVENT.MUTATE, octopus.setTexture);
        let domUI = document.querySelector("div#vui");
        domUI.addEventListener("input", hndInput);
        viewport.canvas.addEventListener("mousedown", hndMouse);
        viewport.canvas.addEventListener("wheel", hndMouse);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        ƒ.Time.game.setTimer(1000, 1, () => {
            let start = tiles[ƒ.Vector2.ZERO().toString()].texture;
            Script.octopus.coatTentacle.texture = start.getTexture();
            Script.octopus.coat.texture = start.getTexture();
            Script.octopus.textureTentacle.setTexture(start);
            Script.octopus.texture.setTexture(start);
        });
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function hndInput(_event) {
        let target = _event.target;
        switch (target.id) {
            case "tint":
                let tint = ƒ.Color.CSS(`hsl(${+target.value * 360}, 80%, 60%)`);
                Script.octopus.textureTentacle.mutate({ tint: tint });
                synth.setCurrentTint(+target.value);
                break;
            case "amplitude":
                let amplitude = 0.5 + +target.value * 4;
                Script.octopus.textureTentacle.mutate({ amplitude: amplitude });
                synth.setCurrentAmplitude(+target.value);
                synth.setCurrentAmplitude(+target.value);
                break;
            case "octaves":
                let octaves = 1 + +target.value * 5;
                Script.octopus.textureTentacle.mutate({ octaves: octaves });
                synth.setCurrentOctaves(+target.value);
                break;
        }
        Script.octopus.setTexture();
    }
    function hndMouse(_event) {
        let posClient = new ƒ.Vector2(_event.clientX, _event.clientY);
        let ray = viewport.getRayFromClient(posClient);
        let posWorld = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Z());
        let posGrid = new ƒ.Vector2(Math.round(posWorld.x), Math.round(posWorld.y));
        switch (_event.type) {
            case "wheel":
                if (Script.octopus.turn(posGrid))
                    Script.octopus.grope(0);
                Script.octopus.grope(_event.deltaY);
                break;
            case "mousedown":
                Script.octopus.moveTo(posGrid);
                Script.octopus.grope(0);
                let tile = tiles[posGrid.toString()];
                console.log(tile.texture.tint, tile.texture.amplitude, tile.texture.octaves);
                break;
        }
    }
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
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Octopus {
        constructor(_node) {
            this.texture = new Script.Texture();
            this.textureTentacle = new Script.Texture();
            this.setTexture = () => {
                this.coatTentacle.texture = this.textureTentacle.getTexture();
            };
            this.node = _node;
            let cmpMaterial = this.node.getComponent(ƒ.ComponentMaterial);
            this.coat = cmpMaterial.material.coat;
            this.tentacle = this.node.getChildByName("Tentacle");
            cmpMaterial = this.tentacle.getComponent(ƒ.ComponentMaterial);
            this.coatTentacle = new ƒ.CoatTextured(new ƒ.Color(), this.textureTentacle.getTexture());
            this.tentacle.getComponent(ƒ.ComponentMaterial).material = new ƒ.Material("mtrTentacle", ƒ.ShaderLitTextured, this.coatTentacle);
            this.grope(1);
        }
        moveTo(_position) {
            this.position = _position;
            this.coat.texture = this.textureTentacle.getTexture();
        }
        grope(_direction) {
            let factor = 0.001;
            let x = this.tentacle.mtxLocal.translation.x - _direction * factor;
            if (_direction == 0) {
                this.tentacle.mtxLocal.translation = ƒ.Vector3.ZERO();
                this.tentacle.mtxLocal.scaling = new ƒ.Vector3(0, 1, 1);
                return;
            }
            this.tentacle.mtxLocal.translation = ƒ.Vector3.X(Math.max(0, Math.min(0.7, x)));
            this.tentacle.mtxLocal.scaling = new ƒ.Vector3(x * 1.2, 1, 1);
        }
        turn(_to) {
            let diff = ƒ.Vector2.DIFFERENCE(_to, this.position);
            let geo = diff.geo;
            if (geo.magnitude > 1.5)
                return false;
            let current = this.node.mtxLocal.rotation.z;
            if (Math.abs(current - geo.angle) < 10)
                return false;
            this.node.mtxLocal.rotation = ƒ.Vector3.Z(geo.angle);
            return true;
        }
        get position() {
            return this.node.mtxLocal.translation.toVector2();
        }
        set position(_position) {
            this.node.mtxLocal.translation = _position.toVector3();
        }
    }
    Script.Octopus = Octopus;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map