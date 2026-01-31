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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let crcOctopus;
    let coatOctopus;
    let ptg;
    let twirl = 0;
    function start(_event) {
        viewport = _event.detail;
        // create texture canvas
        let canvas = document.querySelector("canvas#texture");
        crcOctopus = canvas.getContext("2d");
        // use texture
        let texture = new ƒ.TextureCanvas("test", crcOctopus);
        let octopus = viewport.getBranch().getChildByName("Octopus");
        let cmpMaterial = octopus.getComponent(ƒ.ComponentMaterial);
        coatOctopus = cmpMaterial.material.coat;
        ptg = new PTG.ProceduralTextureGenerator(canvas);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        setTwirl(twirl++);
        if (twirl > 100)
            twirl = 0;
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function setTwirl(_strength) {
        ptg.set([{
                program: 'sinX',
                blendMode: 'add',
                tint: [0, 1, 0],
                frequency: 0.031,
                offset: 0
            }, {
                program: 'sinY',
                blendMode: 'multiply',
                tint: [0, 1, 0],
                frequency: 0.031,
                offset: 0
            }, {
                program: 'twirl',
                tint: [1, 1, 1],
                radius: 100,
                strength: _strength,
                position: [128, 128]
            }]);
        coatOctopus.texture = new ƒ.TextureCanvas("test", crcOctopus);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map