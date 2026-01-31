namespace Script {
  import ƒ = FudgeCore;
  declare const PTG: any;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let crcOctopus: CanvasRenderingContext2D;
  let coatOctopus: ƒ.CoatTextured;
  let ptg: any;
  let twirl: number = 0;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    // create texture canvas
    let canvas: HTMLCanvasElement = document.querySelector("canvas#texture")!;
    crcOctopus = canvas.getContext("2d")!;

    // use texture
    let texture: ƒ.TextureCanvas = new ƒ.TextureCanvas("test", crcOctopus);
    let octopus: ƒ.Node = viewport.getBranch().getChildByName("Octopus");
    let cmpMaterial: ƒ.ComponentMaterial = octopus.getComponent(ƒ.ComponentMaterial);
     coatOctopus = <ƒ.CoatTextured>cmpMaterial.material.coat;

    ptg = new PTG.ProceduralTextureGenerator(canvas);
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }
  
  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    setTwirl(twirl++);
    if (twirl > 100)
      twirl = 0;

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function setTwirl(_strength: number): void {
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
}