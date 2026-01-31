/// <reference path="VUI.ts"/>;
namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;
  declare const PTG: any;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  export let ptg: any;
  let coatOctopus: ƒ.CoatTextured;
  let txtOctopus: Texture = new Texture();

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    let octopus: ƒ.Node = viewport.getBranch().getChildByName("Octopus");
    let cmpMaterial: ƒ.ComponentMaterial = octopus.getComponent(ƒ.ComponentMaterial);
    coatOctopus = <ƒ.CoatTextured>cmpMaterial.material.coat;

    ptg = new PTG.ProceduralTextureGenerator(canvas);

    let domUI: HTMLDivElement = ƒUi.Generator.createInterfaceFromMutable(txtOctopus);
    document.body.appendChild(domUI);
    new ƒUi.Controller(txtOctopus, domUI);
    txtOctopus.addEventListener(ƒ.EVENT.MUTATE, setTexture);
    setTexture();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function setTexture(): void {
    coatOctopus.texture = txtOctopus.getTexture()
  }
}