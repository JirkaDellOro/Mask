namespace Script {
  import ƒ = FudgeCore;
  declare const PTG: any;

  export class Tile extends ƒ.Node {
    private static mesh: ƒ.MeshQuad = new ƒ.MeshQuad("mshTile");

    public constructor() {
      super("Tile");

      this.addComponent(new ƒ.ComponentMesh(Tile.mesh));

      let texture: Texture = new Texture();
      texture.randomize();
      console.log(texture);

      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(new ƒ.Color(), texture.getTexture());
      let material: ƒ.Material = new ƒ.Material("mtrTile", ƒ.ShaderLitTextured, coat);
      this.addComponent(new ƒ.ComponentMaterial(material));
    }
  }
}