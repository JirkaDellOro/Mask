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
    var ƒUi = FudgeUserInterface;
    class Texture extends ƒ.Mutable {
        constructor() {
            super();
            this.tint = new ƒ.Color(0, 1, 0, 10);
            this.density = 0.6;
            this.amplitude = 1;
            this.persistence = 0.5;
            this.octaves = 2;
            this.step = 1;
            // this.health = 100;
            // this.name = "Steve";
            // let vui: HTMLDivElement = document.querySelector("div#vui");
            // new ƒUi.Controller(this, vui);
            let domUI = ƒUi.Generator.createInterfaceFromMutable(this);
            document.body.appendChild(domUI);
            this.addEventListener("mutate" /* ƒ.EVENT.MUTATE */, () => console.log(this));
        }
        reduceMutator(_mutator) {
        }
    }
    Script.Texture = Texture;
})(Script || (Script = {}));
/// <reference path="VUI.ts"/>;
var Script;
/// <reference path="VUI.ts"/>;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let crcOctopus;
    let coatOctopus;
    let ptg;
    let p1 = 0;
    function start(_event) {
        viewport = _event.detail;
        // create texture canvas
        // let canvas: HTMLCanvasElement = document.querySelector("canvas#texture")!;
        let canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        crcOctopus = canvas.getContext("2d");
        // use texture
        // let texture: ƒ.TextureCanvas = new ƒ.TextureCanvas("test", crcOctopus);
        let octopus = viewport.getBranch().getChildByName("Octopus");
        let cmpMaterial = octopus.getComponent(ƒ.ComponentMaterial);
        coatOctopus = cmpMaterial.material.coat;
        ptg = new PTG.ProceduralTextureGenerator(canvas);
        let test = new Script.Texture();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        setTexture(p1++);
        if (p1 > 10)
            p1 = 0;
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function setTexture(_p1) {
        // ptg.set([{
        //   program: 'sinX', blendMode: 'add', tint: [0, 1, 0], frequency: 0.031, offset: 0
        // }, {
        //   program: 'sinY', blendMode: 'multiply', tint: [0, 1, 0], frequency: 0.031, offset: 0
        // }, {
        //   program: 'twirl', tint: [1, 1, 1], radius: 100, strength: _strength, position: [128, 128]
        // }]);
        ptg.set([{
                program: "cellularFractal", blendMode: "add", tint: [0, 1, 0], density: 0.6, amplitude: 1, persistence: 0.5, octaves: 2, step: _p1
            }]);
        coatOctopus.texture = new ƒ.TextureCanvas("test", crcOctopus);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map