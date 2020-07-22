import * as THREE from "three";
import _ from "lodash";

export default function Tag(scene, color, arena) {
  this.scene = scene;
  this.color = color;
  this.arena = arena;

  //webgl real 3d_object container (because of the wrapper class)
  this.object = null;

  this.geometry = new THREE.BoxBufferGeometry(
    this.arena.cellDim,
    this.arena.cellDim,
    this.arena.cellDim
  );
  this.material = new THREE.MeshBasicMaterial({ color: this.color });

  this.add();
}

Tag.prototype = {
  new: function () {
    let tag = new Tag(this.scene, 0xff00ff, this.arena);
    return tag;
  },
  add: function () {
    this.setDefaultPos();
    this.render(this.createTag());
  },
  setDefaultPos: function () {
    this.geometry.translate(
      this.arena.gridOffset,
      this.arena.gridOffset,
      this.arena.gridOffset
    );
  },
  createTag: function () {
    let tag = new THREE.Mesh(this.geometry, this.material);
    tag.position.set(
      this.arena.cellDim *
        _.random(
          -this.arena.gridBounds + this.arena.cellDim,
          this.arena.gridBounds - this.arena.cellDim
        ),
      0,
      this.arena.cellDim *
        _.random(
          -this.arena.gridBounds + this.arena.cellDim,
          this.arena.gridBounds - this.arena.cellDim
        )
    );
    this.object = tag;
    return this.object;
  },
  render: function (tag) {
    this.scene.add(tag);
  },
  remove: function () {
    this.scene.remove(this.object);
  },
  //debug
  dump: function () {
    console.log(this);
  },
};
