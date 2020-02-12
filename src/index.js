import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Arena from './model/Arena';
import Tag from './model/Tag';
import Snake from './model/Snake';

//renderer init
var canvasRef = document.getElementById("main");
var renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvasRef});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//scene, camera and controls (for OrbitControls) init
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 1, 10000);
var controls = new OrbitControls(camera, renderer.domElement);

//arena init
var arena = new Arena(scene, 100, 50);

//tag init
var tag = new Tag(scene, 0xff00ff, arena);

//snake init
var snake = new Snake(scene, 0x00ff00, 5, arena, tag);

//camera and orbit controls setup
    //snake.snakeHead.add(camera);
    //camera.lookAt(snake.snakeHead.position);
camera.position.set(0,80,80);
controls.update();

//keyboard event listener
window.addEventListener('keydown', kbcontrols, false);

//keyboard controls function
function kbcontrols(event) {
    if(!snake.lock && !snake.pauseGuard){
        switch(event.keyCode) {
            case 87: //w 
                if(snake.snakeAxis.forward) {
                    snake.forward();
                    snake.lock = true;
                }
                break;
            case 65: //a
                if(snake.snakeAxis.left) {
                    snake.left();
                    snake.lock = true;
                }
                break;
            case 83: //s
                if(snake.snakeAxis.backward) {
                    snake.backward();
                    snake.lock = true;
                }
                break;
            case 68: //d
                if(snake.snakeAxis.right) {
                    snake.right();
                    snake.lock = true;
                }
                break;
        }
    }
    switch(event.keyCode) {
            case 80: //p
                snake.changeStatus();
                break;
            case 187: //+
                snake.speedIncr();
                break;
            case 189: //-
                snake.speedDecr();
                break;
            case 82: //r
                snake.snakeDestroy();
                break;
    }
}

//hud init function
function hud() {
    document.getElementById("score").innerHTML = snake.score;
    document.getElementById("speed").innerHTML = snake.speed;
    if(snake.pauseGuard) {
        document.getElementById("pause").innerHTML = 'enabled';
    } else {
        document.getElementById("pause").innerHTML = 'disabled';
    }
}

//expose
window.snake = snake;

//render loop
var animate = function () {
    requestAnimationFrame(animate);
    snake.snakeLoop(tag);
    hud();
    renderer.render(scene, camera);
};
animate();