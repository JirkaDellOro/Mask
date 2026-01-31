namespace Script {
  import ƒ = FudgeCore;

  export class Texture extends ƒ.Mutable {
    #step: number;
    #seed: number = ƒ.random.getNorm();
    #density: number;
    #persistence: number;
    public tint: ƒ.Color;
    public amplitude: number;
    public octaves: number;

    constructor() {
      super();
      this.tint = new ƒ.Color(0, 1, 0, 1);
      this.amplitude = 1;
      this.#persistence = 0.5;
      this.octaves = 2;
      this.#density = 0.6;
      this.#step = 1;
    }

    public randomize(): void {
      this.tint = ƒ.Color.CSS(`hsl(${ƒ.random.getRangeFloored(0, 360)}, 80%, 60%)`);
      this.#seed = ƒ.random.getNorm();
      this.#density = 0.5;// ƒ.random.getNorm();
      this.#step = 1;
      this.amplitude = ƒ.random.getRange(0.5, 2);
      this.#persistence = 1;//ƒ.random.getRange(0, 1);
      this.octaves = ƒ.random.getRangeFloored(1, 5);
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
      ptg.set([data])

      return new ƒ.TextureCanvas("test", ptg.ctx);
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {
    }
  }
}