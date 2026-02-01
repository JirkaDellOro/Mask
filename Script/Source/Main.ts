/// <reference path="Texture.ts"/>;
/// <reference path="Tile.ts"/>;
namespace Script {
  import ƒ = FudgeCore;
  // import ƒUi = FudgeUserInterface;
  declare const PTG: any;
  declare const OctoTexture: any;

  type Tiles = { [index: string]: Tile };

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  export let ptg: any;
  export let graphTile: ƒ.Graph;
  const tiles: Tiles = {};
  export let octopus: Octopus;
  let synth: any;

  function start(_event: CustomEvent): void {
    const audioContext = new AudioContext();
    synth = new OctoTexture(audioContext);
    synth.start();

    viewport = _event.detail;
    graphTile = <ƒ.Graph>ƒ.Project.getResourcesByName("Tile")[0];
    viewport.camera.mtxPivot.translateZ(5);
    viewport.camera.mtxPivot.rotateY(180);

    setupFloor();
    octopus = new Octopus(viewport.getBranch().getChildByName("Octopus"))

    // let domUI: HTMLDivElement = ƒUi.Generator.createInterfaceFromMutable(octopus.textureTentacle);
    // document.body.appendChild(domUI);
    // new ƒUi.Controller(octopus.textureTentacle, domUI);
    // octopus.textureTentacle.addEventListener(ƒ.EVENT.MUTATE, octopus.setTexture);

    let domUI: HTMLDivElement = document.querySelector("div#vui");
    domUI.addEventListener("input", hndInput);

    viewport.canvas.addEventListener("mousedown", hndMouse);
    viewport.canvas.addEventListener("wheel", hndMouse);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    ƒ.Time.game.setTimer(1000, 1, () => {
      let start: Texture = tiles[ƒ.Vector2.ZERO().toString()].texture;
      octopus.coatTentacle.texture = start.getTexture();
      octopus.coat.texture = start.getTexture();
      octopus.textureTentacle.setTexture(start);
      octopus.texture.setTexture(start);
    });
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function hndInput(_event: Event): void {
    let target: HTMLInputElement = (<HTMLInputElement>_event.target);

    switch (target.id) {
      case "tint":
        let tint: ƒ.Color = ƒ.Color.CSS(`hsl(${+target.value * 360}, 80%, 60%)`);
        octopus.textureTentacle.mutate({ tint: tint });
        synth.setCurrentTint(+target.value);
        break;
      case "amplitude":
        let amplitude: number = 0.5 + +target.value * 4;
        octopus.textureTentacle.mutate({ amplitude: amplitude });
        synth.setCurrentAmplitude(+target.value);
        synth.setCurrentAmplitude(+target.value);
        break;
      case "octaves":
        let octaves: number = 1 + +target.value * 5;
        octopus.textureTentacle.mutate({ octaves: octaves });
        synth.setCurrentOctaves(+target.value);
        break;
    }
    octopus.setTexture();
  }

  function hndMouse(_event: MouseEvent | WheelEvent): void {
    let posClient: ƒ.Vector2 = new ƒ.Vector2(_event.clientX, _event.clientY);
    let ray: ƒ.Ray = viewport.getRayFromClient(posClient);
    let posWorld: ƒ.Vector3 = ray.intersectPlane(ƒ.Vector3.ZERO(), ƒ.Vector3.Z());
    let posGrid: ƒ.Vector2 = new ƒ.Vector2(Math.round(posWorld.x), Math.round(posWorld.y));

    switch (_event.type) {
      case "wheel":
        if (octopus.turn(posGrid))
          octopus.grope(0);
        octopus.grope((<WheelEvent>_event).deltaY);
        break;
      case "mousedown":
        octopus.moveTo(posGrid);
        octopus.grope(0);
        let tile: Tile = tiles[posGrid.toString()];
        console.log(tile.texture.tint, tile.texture.amplitude, tile.texture.octaves);
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