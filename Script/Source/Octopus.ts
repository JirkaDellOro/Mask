namespace Script {
  import ƒ = FudgeCore;

  export class Octopus {
    private node: ƒ.Node;
    private tentacle: ƒ.Node;
    public coat: ƒ.CoatTextured;
    public texture: Texture = new Texture();
    public coatTentacle: ƒ.CoatTextured;
    public textureTentacle: Texture = new Texture();


    public constructor(_node: ƒ.Node) {
      this.node = _node;
      let cmpMaterial: ƒ.ComponentMaterial = this.node.getComponent(ƒ.ComponentMaterial);
      this.coat = <ƒ.CoatTextured>cmpMaterial.material.coat;

      this.tentacle = this.node.getChildByName("Tentacle");
      cmpMaterial = this.tentacle.getComponent(ƒ.ComponentMaterial);
      this.coatTentacle = new ƒ.CoatTextured(new ƒ.Color(), this.textureTentacle.getTexture());
      this.tentacle.getComponent(ƒ.ComponentMaterial).material = new ƒ.Material("mtrTentacle", ƒ.ShaderLitTextured, this.coatTentacle);
      this.grope(1);
    }

    public moveTo(_position: ƒ.Vector2) {
      this.position = _position;
      this.coat.texture = this.textureTentacle.getTexture();
    }

    public grope(_direction: number): void {
      let factor = 0.001;
      let x: number = this.tentacle.mtxLocal.translation.x - _direction * factor;
      if (_direction == 0) {
        this.tentacle.mtxLocal.translation = ƒ.Vector3.ZERO();
        this.tentacle.mtxLocal.scaling = new ƒ.Vector3(0, 1, 1);
        return
      }

      this.tentacle.mtxLocal.translation = ƒ.Vector3.X(Math.max(0, Math.min(0.7, x)));
      this.tentacle.mtxLocal.scaling = new ƒ.Vector3(x * 1.2, 1, 1);
    }

    public setTexture = (): void => {
      this.coatTentacle.texture = this.textureTentacle.getTexture();
    }

    public turn(_to: ƒ.Vector2): boolean {
      let diff: ƒ.Vector2 = ƒ.Vector2.DIFFERENCE(_to, this.position);
      let geo: ƒ.Geo2 = diff.geo;

      if (geo.magnitude > 1.5)
        return false;

      let current: number = this.node.mtxLocal.rotation.z;
      if (Math.abs(current - geo.angle) < 10)
        return false;

      this.node.mtxLocal.rotation = ƒ.Vector3.Z(geo.angle);
      return true;
    }

    public get position(): ƒ.Vector2 {
      return this.node.mtxLocal.translation.toVector2();
    }
    public set position(_position: ƒ.Vector2) {
      this.node.mtxLocal.translation = _position.toVector3();
    }
  }
}