namespace Script {
  import ƒ = FudgeCore;
  // declare const PTG: any;

  export class Tile extends ƒ.Node {
    private static mesh: ƒ.MeshQuad = new ƒ.MeshQuad("mshTile");
    private texture: Texture;
    private ptg: any;

    public constructor(_position: ƒ.Vector2) {
      super("Tile");
      this.ptg = setupGenerator();
      this.addComponent(new ƒ.ComponentMesh(Tile.mesh));

      this.texture = new Texture();
      this.texture.randomize();

      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(new ƒ.Color(), this.texture.getTexture(this.ptg));
      let material: ƒ.Material = new ƒ.Material("mtrTile", ƒ.ShaderLitTextured, coat);
      this.addComponent(new ƒ.ComponentMaterial(material));

      this.addComponent(new ƒ.ComponentTransform);
      this.mtxLocal.translate(_position.toVector3());
    }
  }
}