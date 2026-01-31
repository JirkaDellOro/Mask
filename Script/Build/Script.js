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
        #step;
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
            this.#step = 1;
        }
        randomize() {
            this.tint = ƒ.Color.CSS(`hsl(${ƒ.random.getRangeFloored(0, 360)}, 80%, 60%)`);
            this.#seed = ƒ.random.getNorm();
            this.#density = 0.5; // ƒ.random.getNorm();
            this.#step = 1;
            this.amplitude = ƒ.random.getRange(0.5, 2);
            this.#persistence = 1; //ƒ.random.getRange(0, 1);
            this.octaves = ƒ.random.getRangeFloored(1, 5);
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
            Script.ptg.set([data]);
            return new ƒ.TextureCanvas("test", Script.ptg.ctx);
        }
        reduceMutator(_mutator) {
        }
    }
    Script.Texture = Texture;
})(Script || (Script = {}));
/// <reference path="Texture.ts"/>;
var Script;
/// <reference path="Texture.ts"/>;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let coatOctopus;
    let txtOctopus = new Script.Texture();
    // let controller: ƒUi.Controller;
    function start(_event) {
        viewport = _event.detail;
        let canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        let octopus = viewport.getBranch().getChildByName("Octopus");
        let cmpMaterial = octopus.getComponent(ƒ.ComponentMaterial);
        coatOctopus = cmpMaterial.material.coat;
        Script.ptg = new PTG.ProceduralTextureGenerator(canvas);
        // txtOctopus.randomize();
        // setTexture();
        let domUI = ƒUi.Generator.createInterfaceFromMutable(txtOctopus);
        document.body.appendChild(domUI);
        new ƒUi.Controller(txtOctopus, domUI);
        txtOctopus.addEventListener("mutate" /* ƒ.EVENT.MUTATE */, setTexture);
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
    function setTexture() {
        coatOctopus.texture = txtOctopus.getTexture();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map