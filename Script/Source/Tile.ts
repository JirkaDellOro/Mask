namespace Script {
  import ƒ = FudgeCore;

  export class Tile extends ƒ.GraphInstance {
    public constructor() {
      super(graphTile);
      this.reset();
    }
  }
}