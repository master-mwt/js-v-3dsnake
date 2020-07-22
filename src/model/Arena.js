import * as THREE from "three";

export default function Arena(scene, size, divisions) {
  this.scene = scene;
  this.gridSize = size;
  this.gridDivisions = divisions;

  this.cellDim = this.gridSize / this.gridDivisions;
  this.gridOffset = this.gridSize / this.gridDivisions / 2;
  this.gridBounds = this.gridDivisions / 2;
  this.gridLimitPos = this.gridDivisions;
  this.gridLimitNeg = -this.gridDivisions - this.cellDim;

  //webgl real 3d_object container (because of the wrapper class)
  this.object = null;

  this.init();
}

Arena.prototype = {
  init: function () {
    let arena = new THREE.GridHelper(this.gridSize, this.gridDivisions);
    this.object = arena;
    this.scene.add(arena);
  },
  //debug
  dump: function () {
    console.log(this);
  },
};
