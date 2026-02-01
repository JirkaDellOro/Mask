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
  const tiles: Tiles = {};
  export let octopus: Octopus;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graphTile = <ƒ.Graph>ƒ.Project.getResourcesByName("Tile")[0];
    viewport.camera.mtxPivot.translateZ(5);
    viewport.camera.mtxPivot.rotateY(180);

    setupFloor();
    octopus = new Octopus(viewport.getBranch().getChildByName("Octopus"))

    let domUI: HTMLDivElement = ƒUi.Generator.createInterfaceFromMutable(octopus.texture);
    document.body.appendChild(domUI);
    new ƒUi.Controller(octopus.texture, domUI);
    octopus.texture.addEventListener(ƒ.EVENT.MUTATE, octopus.setTexture);

    viewport.canvas.addEventListener("mousedown", hndMouse);
    viewport.canvas.addEventListener("mouseup", hndMouse);
    viewport.canvas.addEventListener("wheel", hndMouse);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    ƒ.Time.game.setTimer(1000, 1, () => {
      octopus.texture.randomize();
      octopus.setTexture();
    });
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function hndMouse(_event: MouseEvent): void {
    let posClient: ƒ.Vector2 = new ƒ.Vector2(_event.clientX, _event.clientY);
    let ray: ƒ.Ray = viewport.getRayFromClient(posClient);
    let posWorld: ƒ.Vector3 = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Z());
    let posGrid: ƒ.Vector2 = new ƒ.Vector2(Math.round(posWorld.x), Math.round(posWorld.y));

    switch (_event.type) {
      case "wheel":
        octopus.moveTo(posGrid);
        break;
      case "mousedown":
        let tile: Tile = tiles[posGrid.toString()];
        console.log(tile.texture.tint, tile.texture.amplitude, tile.texture.octaves);
        octopus.stretch(posGrid);
        break;
      case "mouseup":
        octopus.stretch(null);
        break;
    }
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
}