/// <reference path="Texture.ts"/>;
/// <reference path="Tile.ts"/>;
namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;
  declare const PTG: any;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  export let ptg: any;
  export let graphTile: ƒ.Graph;
  let coatOctopus: ƒ.CoatTextured;
  let txtOctopus: Texture = new Texture();

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graphTile = <ƒ.Graph>ƒ.Project.getResourcesByName("Tile")[0];
    console.log(graphTile);

    // viewport.getBranch().getChildByName("Tile");

    let tile: Tile = new Tile();

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

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    ƒ.Time.game.setTimer(1000, 1, () => {
      txtOctopus.randomize();
      setTexture();
    });
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