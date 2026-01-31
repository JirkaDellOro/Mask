namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let crcOctopus: CanvasRenderingContext2D;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    // create texture canvas
    let canvas: HTMLCanvasElement = document.querySelector("canvas#texture")!;
    crcOctopus = canvas.getContext("2d")!;
    crcOctopus.fillStyle = "blue";
    crcOctopus.strokeStyle = "white";
    crcOctopus.lineWidth = 10;
    crcOctopus.fillRect(0, 0, canvas.width, canvas.height);
    crcOctopus.moveTo(0, 0);
    crcOctopus.lineTo(canvas.width, canvas.height);
    crcOctopus.stroke();

    // use texture
    let texture: ƒ.TextureCanvas = new ƒ.TextureCanvas("test", crcOctopus);
    let octopus: ƒ.Node = viewport.getBranch().getChildByName("Octopus");
    let cmpMaterial: ƒ.ComponentMaterial = octopus.getComponent(ƒ.ComponentMaterial);
    let coat: ƒ.CoatTextured = <ƒ.CoatTextured>cmpMaterial.material.coat;
    coat.texture = texture;
    
    crcOctopus.moveTo(canvas.width, 0);
    crcOctopus.lineTo(0, canvas.height);
    crcOctopus.stroke();


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}