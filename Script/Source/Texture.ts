namespace Script {
  import ƒ = FudgeCore;
  declare const PTG: any;

  export class Texture extends ƒ.Mutable {
    #seed: number = ƒ.random.getNorm();
    #density: number;
    #persistence: number;
    public tint: ƒ.Color;
    public amplitude: number;
    public octaves: number;
    public ptg: any;

    constructor() {
      super();
      this.tint = new ƒ.Color(0, 1, 0, 1);
      this.amplitude = 1;
      this.#persistence = 0.5;
      this.octaves = 2;
      this.#density = 0.6;
      this.ptg = this.setupGenerator();
    }

    private setupGenerator(): any {
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      return new PTG.ProceduralTextureGenerator(canvas);
    }

    public randomize(): void {
      this.tint = ƒ.Color.CSS(`hsl(${ƒ.random.getRangeFloored(0, 360)}, 80%, 60%)`);
      this.#seed = ƒ.random.getNorm();
      this.octaves = ƒ.random.getRange(1, 4);
      this.amplitude = ƒ.random.getRange(0.5, 2 - this.octaves / 4);
      this.#persistence = 1;//ƒ.random.getRange(0, 1);
      this.#density = 0.5;// ƒ.random.getNorm();
    }

    public getTexture(): ƒ.TextureCanvas {
      let data = {
        program: "cellularFractal",
        blendMode: "add",
        seed: this.#seed,
        tint: [this.tint.r, this.tint.g, this.tint.b],
        density: this.#density,
        amplitude: this.amplitude,
        persistence: this.#persistence,
        octaves: this.octaves,
        step: this.octaves
      }
      this.ptg.set([data])

      // let rim: number = 5;
      // for (let a: number=0; a<rim; a++) {
      //   _ptg.ctx.fillStyle = `rgba(255,255,255,${a/rim}`;
      //   _ptg.ctx.fillRect(a,a,ptg.ctx.canvas.width-a, _ptg.ctx.canvas.height-a);
      // }

      return new ƒ.TextureCanvas("test", this.ptg.ctx);
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {
    }
  }
}