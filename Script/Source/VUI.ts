namespace Script {
  import ƒ = FudgeCore;

  export class Texture extends ƒ.Mutable {
    public tint: ƒ.Color;
    public density: number;
    public amplitude: number;
    public persistence: number;
    public octaves: number;
    public step: number;

    constructor() {
      super();
      this.tint = new ƒ.Color(0, 1, 0, 1);
      this.density = 0.6;
      this.amplitude = 1;
      this.persistence = 0.5;
      this.octaves = 2;
      this.step = 1;
    }

    public getTexture(): ƒ.TextureCanvas {
      let data = {
        program: "cellularFractal",
        blendMode: "add",
        tint: [this.tint.r, this.tint.g, this.tint.b], 
        density: this.density, 
        amplitude: this.amplitude, 
        persistence: this.persistence, 
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