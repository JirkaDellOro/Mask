namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;

  export class Texture extends ƒ.Mutable {
    public tint: ƒ.Color;
    public density: number;
    public amplitude: number;
    public persistence: number;
    public octaves: number;
    public step: number;


    constructor() {
      super();
      this.tint = new ƒ.Color(0, 1, 0, 10);
      this.density = 0.6;
      this.amplitude = 1;
      this.persistence = 0.5;
      this.octaves = 2;
      this.step = 1;

      // this.health = 100;
      // this.name = "Steve";

      // let vui: HTMLDivElement = document.querySelector("div#vui");
      // new ƒUi.Controller(this, vui);

      let domUI: HTMLDivElement = ƒUi.Generator.createInterfaceFromMutable(this);
      document.body.appendChild(domUI);

      this.addEventListener(ƒ.EVENT.MUTATE, () => console.log(this));
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {
    }
  }
}