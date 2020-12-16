/*
  Johan Karlsson
  https://github.com/DonKarlssonSan/vectory
  MIT License, see Details View

*/

"use strict";


/*

const position = new Vector(0, 0);
const acceleration = new Vector(-1, 1);
position.addTo(acceleration);
acceleration.multTo(0.9);

const position = {x: 0, y: 0}
const acceleration = {x: -1, y: -1}
position.x += acceleration.x;
position.y += acceleration.y;
acceleration.x *= 0.9;
acceleration.y *= 0.9;

*/

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(
      this.x + v.x,
      this.y + v.y);
  }

  addTo(v) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v) {
    return new Vector(
      this.x - v.x,
      this.y - v.y);
  }
  
  subFrom(v) {
    this.x -= v.x;
    this.y -= v.y;
  }
  
  mult(n) {
    return new Vector(this.x * n, this.y * n);
  }
  
  multTo(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }
  
  div(n) {
    return new Vector(this.x / n, this.y / n);
  }
  
  divTo(n) {
    this.x /= n;
    this.y /= n;
  }
  
  setAngle(angle) {
    var length = this.getLength();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }
  
  setLength(length) {
    var angle = this.getAngle();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }
  
  getAngle() {
    return Math.atan2(this.y, this.x);
  }
  
  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getLengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  distanceTo(v) {
    return this.sub(v).getLength();
  }
  
  distanceToSq(v) {
    return this.sub(v).getLengthSq();
  }

  manhattanDistanceTo(v) {
    return Math.abs(v.x - this.x) + Math.abs(v.y - this.y);
  }
  
  copy() {
    return new Vector(this.x, this.y);
  }
  
  rotate(angle) {
    return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
  }
}
