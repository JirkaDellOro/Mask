/// <reference path="Texture.ts"/>;
/// <reference path="Tile.ts"/>;
namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;
  declare const PTG: any;

  type Tiles = { [index: string]: Tile };

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  export let ptg: any;
  export let graphTile: ƒ.Graph;
  let coatOctopus: ƒ.CoatTextured;
  let txtOctopus: Texture = new Texture();
  const tiles: Tiles = {};

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graphTile = <ƒ.Graph>ƒ.Project.getResourcesByName("Tile")[0];
    viewport.camera.mtxPivot.translateZ(5);
    viewport.camera.mtxPivot.rotateY(180);

    ptg = setupGenerator();
    setupFloor();
    setupOctopus();

    let domUI: HTMLDivElement = ƒUi.Generator.createInterfaceFromMutable(txtOctopus);
    document.body.appendChild(domUI);
    new ƒUi.Controller(txtOctopus, domUI);
    txtOctopus.addEventListener(ƒ.EVENT.MUTATE, setTexture);

    viewport.canvas.addEventListener("mousemove", hndMouseMove);

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

  function hndMouseMove(_event: MouseEvent): void {
    let posClient: ƒ.Vector2 = new ƒ.Vector2(_event.clientX, _event.clientY);
    let ray: ƒ.Ray = viewport.getRayFromClient(posClient);
    let posWorld: ƒ.Vector3 = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Z());
    let posGrid: ƒ.Vector2 = new ƒ.Vector2(Math.round(posWorld.x), Math.round(posWorld.y));
    console.log(posGrid);
  }

  function setTexture(): void {
    coatOctopus.texture = txtOctopus.getTexture(ptg);
  }

  export function setupGenerator(): any {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    return new PTG.ProceduralTextureGenerator(canvas);
  }

  function setupFloor(): void {
    for (let y: number = -2; y <= 2; y++)
      for (let x: number = -2; x <= 2; x++) {
        let posTile: ƒ.Vector2 = new ƒ.Vector2(x, y)
        let tile: Tile = new Tile(posTile);
        tiles[posTile.toString()] = tile;
        viewport.getBranch().addChild(tile);
      }
      console.log(tiles);
  }

  function setupOctopus(): void {
    let octopus: ƒ.Node = viewport.getBranch().getChildByName("Octopus");
    let cmpMaterial: ƒ.ComponentMaterial = octopus.getComponent(ƒ.ComponentMaterial);
    coatOctopus = <ƒ.CoatTextured>cmpMaterial.material.coat;
  }
}