import * as THREE from 'three';
import _ from 'lodash';

export default function Snake(scene, color, speed, arena, tag) {
    this.scene = scene;
    this.color = color;
    this.speed = speed;
    this.arena = arena;
    this.tag = tag;
    
    this.snakeArray = [];
    this.snakeHead = null;
    //this.snakeBody = _.drop(snake.snakeArray);
    this.renderCounter = 0;
    this.score = 0;

    this.speedDecrGuard = false;
    this.speedIncrGuard = false;
    this.initSpeed = speed;
    this.pauseGuard = false;

    this.snakeDir = null;
    this.snakeAxis = {
        right: true,
        left: true,
        forward: true,
        backward: true,
    };

    this.lock = false;
    this.prevSnakeDir = null;
    this.prevblock_prevpos = null;

    this.snakeMoveVectorX = new THREE.Vector3(this.arena.cellDim,0,0);
    this.snakeMoveVectorZ = new THREE.Vector3(0,0,this.arena.cellDim);

    // this.snakePos = null;
    // this.onSelfCollision = function() {};
    // this.onTagCollision = function() {};

    this.geometry = new THREE.BoxBufferGeometry(this.arena.cellDim, this.arena.cellDim, this.arena.cellDim);
    this.material = new THREE.MeshBasicMaterial({color: this.color});
    
    this.init();
}

Snake.prototype = {
    init: function() {
        this.setDefaultPos();
        this.addHead();
        this.render();
        this.setPrevPos();
    },
    setDefaultPos: function() {
        this.geometry.translate(this.arena.gridOffset,this.arena.gridOffset,this.arena.gridOffset);
    },
    addHead: function() {
        let head = this.createBlock(0,0,0);
        this.snakeHead = head;
        this.snakeArray.push(head);
    },
    addCube: function() {
        this.snakeArray.push(this.createBlock(this.snakeHead.prev_position.x, this.snakeHead.prev_position.y, this.snakeHead.prev_position.z));
    },
    createBlock: function(x,y,z) {
        let cube = new THREE.Mesh(this.geometry, this.material);
        cube.position.set(x,y,z);
        return cube;
    },
    render: function() {
        this.snakeArray.forEach(block => {
            this.scene.add(block);
        });
    },
    forward: function() {
        this.snakeDir = 'forward';
        this.snakeAxis.forward = false;
        this.snakeAxis.backward = false;
        this.snakeAxis.left = true;
        this.snakeAxis.right = true;
    },
    backward: function() {
        this.snakeDir = 'backward';
        this.snakeAxis.forward = false;
        this.snakeAxis.backward = false;
        this.snakeAxis.left = true;
        this.snakeAxis.right = true;
    },
    left: function() {
        this.snakeDir = 'left';
        this.snakeAxis.forward = true;
        this.snakeAxis.backward = true;
        this.snakeAxis.left = false;
        this.snakeAxis.right = false;
    },
    right: function() {
        this.snakeDir = 'right';
        this.snakeAxis.forward = true;
        this.snakeAxis.backward = true;
        this.snakeAxis.left = false;
        this.snakeAxis.right = false;
    },
    moveForward: function() {
        this.snakeHead.prev_position = this.snakeHead.position.clone();
        let newpos =  this.snakeHead.position.sub(this.snakeMoveVectorZ);
        this.snakeHead.position.set(newpos.x, newpos.y, newpos.z);
        this.updateBodyPos();
    },
    moveBackward: function() {
        this.snakeHead.prev_position = this.snakeHead.position.clone();
        let newpos =  this.snakeHead.position.add(this.snakeMoveVectorZ);
        this.snakeHead.position.set(newpos.x, newpos.y, newpos.z);
        this.updateBodyPos();
    },
    moveLeft: function() {
        this.snakeHead.prev_position = this.snakeHead.position.clone();
        let newpos =  this.snakeHead.position.sub(this.snakeMoveVectorX);
        this.snakeHead.position.set(newpos.x, newpos.y, newpos.z);
        this.updateBodyPos();
    },
    moveRight: function() {
        this.snakeHead.prev_position = this.snakeHead.position.clone();
        let newpos =  this.snakeHead.position.add(this.snakeMoveVectorX);
        this.snakeHead.position.set(newpos.x, newpos.y, newpos.z);
        this.updateBodyPos();
    },
    setPrevPos: function() {
        this.snakeArray.forEach(block => {
            block["prev_position"] = null;
        });
    },
    snakePosCheck: function() {
        if(this.snakeHead.position.x === this.arena.gridLimitPos) {
            this.snakeHead.position.x = this.arena.gridLimitNeg+this.arena.cellDim;
        } else if(this.snakeHead.position.x === this.arena.gridLimitNeg) {
            this.snakeHead.position.x = this.arena.gridLimitPos-this.arena.cellDim;
        } else if(this.snakeHead.position.z === this.arena.gridLimitPos) {
            this.snakeHead.position.z = this.arena.gridLimitNeg+this.arena.cellDim;
        } else if(this.snakeHead.position.z === this.arena.gridLimitNeg) {
            this.snakeHead.position.z = this.arena.gridLimitPos-this.arena.cellDim;
        }
    },
    addScore: function() {
        this.score++;
    },
    refreshScore: function() {
        this.score = 0;
    },
    tagCollision: function(tag) {
        if(this.isHit(this.snakeHead, this.tag.object)) {
            this.tag.remove();
            this.tag = this.tag.new();
            this.addScore();
            this.addCube();
            this.render();
        }
    },
    selfCollision: function() {
        _.drop(this.snakeArray).forEach(block => {
            if(this.isHit(this.snakeHead, block)) {
                this.snakeDestroy();
            }
        });
    },
    isHit: function(blk1, blk2) {
        if (blk1.position.x == blk2.position.x && blk1.position.z == blk2.position.z) {
            return true;
        } else {
            return false;
        }
    },
    snakeDestroy: function() {
        _.drop(this.snakeArray).forEach(block => {
            this.scene.remove(block);
            _.remove(this.snakeArray, block);
        });
        this.reset();
    },
    reset: function() {
        this.tag.remove();
        this.tag = this.tag.new();
        this.refreshScore();
        this.snakeHead.position.set(0,0,0)
        this.snakeDir = null;
        this.snakeAxis = {
            right: true,
            left: true,
            forward: true,
            backward: true,
        };
        this.speed = this.initSpeed;
        this.pauseGuard = false;
    },
    updateBodyPos: function() {
        _.drop(this.snakeArray).forEach((block, index) => {
            if(index === 0) {
                block.prev_position = block.position.clone();
                block.position.set(this.snakeHead.prev_position.x, this.snakeHead.prev_position.y, this.snakeHead.prev_position.z);
                this.prevblock_prevpos = block.prev_position.clone();
            } else {
                block.prev_position = block.position.clone();
                block.position.set(this.prevblock_prevpos.x, this.prevblock_prevpos.y, this.prevblock_prevpos.z);
                this.prevblock_prevpos = block.prev_position.clone();
            }
        });
    },
    changeStatus: function() {
        this.pauseGuard = !this.pauseGuard;
        if(this.pauseGuard) {
            this.prevSnakeDir = this.snakeDir;
            this.snakeDir = '';
            this.snakeAxis = {
                right: true,
                left: true,
                forward: true,
                backward: true,
            };
            document.getElementById('status_button').innerHTML = 'resume';
        } else {
            this.snakeDir = this.prevSnakeDir;
            document.getElementById('status_button').innerHTML = 'pause';
        }
    },
    speedIncr: function() {
        this.speedIncrGuard = true;
    },
    speedDecr: function() {
        this.speedDecrGuard = true;
    },
    speedCheck: function() {
        if(this.speedIncrGuard) {
            if(this.speed == 0) {
                this.speed = 0;
            } else {
                this.speed -= 1;
            }
            this.speedIncrGuard = false;
        }
        if(this.speedDecrGuard) {
            if(this.speed == 10) {
                this.speed = 10;
            } else {
                this.speed += 1;
            }
            this.speedDecrGuard = false;
        }
    },
    snakeLoop: function(tag) {
        if(this.renderCounter === this.speed) {
            this.speedCheck();
            switch(this.snakeDir) {
                case 'forward':
                    this.moveForward();
                    break;
                case 'backward':
                    this.moveBackward();
                    break;
                case 'left':
                    this.moveLeft();
                    break;
                case 'right':
                    this.moveRight();
                    break;
            }
            this.snakePosCheck();
            this.tagCollision(tag);
            this.selfCollision();
            this.renderCounter = 0;
            this.lock = false;
        } else {
            this.renderCounter++;
        }
    },
    //debug
    dump: function() {
        console.log(this);
    }
}