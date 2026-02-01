namespace Script {
  import ƒ = FudgeCore;

  export class Octopus {
    private node: ƒ.Node;
    public coat: ƒ.CoatTextured;
    public texture: Texture = new Texture();

    public constructor(_node: ƒ.Node) {
      this.node = _node;
      let cmpMaterial: ƒ.ComponentMaterial = this.node.getComponent(ƒ.ComponentMaterial);
      this.coat = <ƒ.CoatTextured>cmpMaterial.material.coat;
    }

    public setTexture = (): void => {
      this.coat.texture = this.texture.getTexture(ptg);
    }

    public stretch(_to: ƒ.Vector2): void {
      if (!_to) {
        this.node.getChildByName("Tentacle").activate(false);
        return;
      }
      
      let diff: ƒ.Vector2 = ƒ.Vector2.DIFFERENCE(_to, this.position);
      let geo: ƒ.Geo2 = diff.geo;

      if (geo.magnitude > 1.5)
        return;
      
      this.node.mtxLocal.rotation = ƒ.Vector3.Z(geo.angle);
      this.node.getChildByName("Tentacle").activate(true);
    }

    public get position(): ƒ.Vector2 {
      return this.node.mtxLocal.translation.toVector2();
    }
    public set position(_position: ƒ.Vector2) {
      this.node.mtxLocal.translation = _position.toVector3();
    }
  }
}