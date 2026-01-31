/// <reference path="VUI.ts"/>;
namespace Script {
  import ƒ = FudgeCore;
  declare const PTG: any;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let crcOctopus: CanvasRenderingContext2D;
  let coatOctopus: ƒ.CoatTextured;
  let ptg: any;
  let p1: number = 0;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    // create texture canvas
    // let canvas: HTMLCanvasElement = document.querySelector("canvas#texture")!;
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    crcOctopus = canvas.getContext("2d")!;

    // use texture
    // let texture: ƒ.TextureCanvas = new ƒ.TextureCanvas("test", crcOctopus);
    let octopus: ƒ.Node = viewport.getBranch().getChildByName("Octopus");
    let cmpMaterial: ƒ.ComponentMaterial = octopus.getComponent(ƒ.ComponentMaterial);
    coatOctopus = <ƒ.CoatTextured>cmpMaterial.material.coat;

    ptg = new PTG.ProceduralTextureGenerator(canvas);
    
    let test: Texture = new Texture();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    setTexture(p1++);
    if (p1 > 10)
      p1 = 0;

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function setTexture(_p1: number): void {
    // ptg.set([{
    //   program: 'sinX', blendMode: 'add', tint: [0, 1, 0], frequency: 0.031, offset: 0
    // }, {
    //   program: 'sinY', blendMode: 'multiply', tint: [0, 1, 0], frequency: 0.031, offset: 0
    // }, {
    //   program: 'twirl', tint: [1, 1, 1], radius: 100, strength: _strength, position: [128, 128]
    // }]);

    ptg.set([{
      program: "cellularFractal", blendMode: "add", tint: [0, 1, 0], density: 0.6, amplitude: 1, persistence: 0.5, octaves: 2, step: _p1
    }])

    coatOctopus.texture = new ƒ.TextureCanvas("test", crcOctopus);
  }
}