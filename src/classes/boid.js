import math from 'mathjs';

import {
    Vector
} from "p5";

import Actor from './actor.js';

export default class Boid extends Actor {
    MAX_DIST = 400;
    MAX_FORCE = 2.5;
    DEF_HEALTH = 100;

    constructor(position, mass, radius, ) {
        super(position, mass, radius);
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(math.random(-1, 1), math.random(-1, 1));
        this.force = createVector(0, 0);
        this.maxSpeed = 3;
        this.genome = math.map(math.zeros(5, 5), function (value) {
            return math.random(-1, 1);
        });
        this.health = this.DEF_HEALTH;
        this.age = 0;
    }

    tick() {
        this.velocity.add(this.acceleration).limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.health -= .6;
        this.age++;
    }

    dist(other) {
        if (other instanceof Vector)
            return this.position.dist(other);
        else if (other instanceof Actor)
            return this.position.dist(other.position);
    }

    gene(index1, index2) {
        return this.genome._data[index1][index2];
    }

    addForce(force) {
        this.force.add(force.limit(this.MAX_FORCE));
    }

    applyForce() {
        this.acceleration.add(this.force.limit(this.MAX_FORCE).div(this.mass));
    }

    seek(other) {
        let desired;
        if (other instanceof Actor)
            other = other.position;
        return Vector.sub(other, this.position).setMag(this.maxSpeed).sub(this.velocity);
    }

    flee(other) {
        return this.seek(other).mult(-1);
    }

    arrive(other) {
        let desired = Vector.sub(other.position, this.position);
        let d = desired.mag();
        if (d <= 80)
            desired.setMag(map(d, 0, 80, 0, this.maxSpeed));
        else
            desired.setMag(this.maxSpeed);
        return desired.sub(this.velocity);
    }

    pursue(other) {
        let desired = Vector.sub(Vector.add(other.position, other.velocity), this.position).setMag(this.maxSpeed);
        return desired.sub(this.velocity);
    }

    evade(other) {
        return this.pursue(other).mult(-1);
    }

    mutate(rate = .25) {
        math.map(this.genome, function (value) {
            if (math.random() <= rate)
                value += math.random(0, .5);
            return value;
        });
    }

    draw() {
        fill(127);
        stroke(200);
        strokeWeight(1);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading() + PI);
        beginShape();
        vertex(-.5 * this.r, 0);
        vertex(this.r * .75, -this.r * .5);
        vertex(.45 * this.r, 0);
        vertex(this.r * .75, this.r * .5);
        endShape(CLOSE);
        pop();
    }
}