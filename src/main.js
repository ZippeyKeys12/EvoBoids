import math from 'mathjs';

import Boid from './classes/boid';

const FOOD_SIZE = 5,
    CANVAS_WIDTH = 800,
    CANVAS_HEIGHT = 600;

var boids = [],
    food = [];

window.setup = function () {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent("canvas");
    for (let i = 0; i < 50; i++)
        boids.push(new Boid(Helper.screenPoint(CANVAS_WIDTH, CANVAS_HEIGHT), 8, 10));
    for (let i = 0; i < 100; i++)
        food.push(Helper.screenPoint(CANVAS_WIDTH, CANVAS_HEIGHT));
}

window.draw = function () {
    background(0);
    boids.forEach(boid => {
        let neighbors = [];
        // Food
        for (const piece of food) {
            if (boid.dist(piece) <= abs(boid.gene(1, 0)) * boid.MAX_DIST)
                boid.addForce(boid.seek(piece).setMag(boid.gene(1, 1) * boid.MAX_FORCE))
            if (boid.dist(piece) <= boid.r + FOOD_SIZE) {
                let index = food.indexOf(piece);
                if (index > -1)
                    food.splice(index, 1);
                boid.health += 25;
            }
        }
        for (const other of boids) {
            if (Object.is(boid, other))
                continue;
            if (boid.dist(other) <= abs(boid.gene(0, 0)) * boid.MAX_DIST)
                neighbors.push(other.position);
            if ((boid.dist(other) <= boid.r + other.r))
                boid.addForce(boid.flee(other));
        }
        if (neighbors.length > 0)
            boid.addForce(boid.seek(Helper.centerOfMass(neighbors)).setMag(boid.gene(0, 1) * boid.MAX_FORCE));
        boid.applyForce();
        boid.tick();
        if (boid.age >= 200) {
            let newb;
            for (let i = 0; i < 1; i++) {
                boids.push(newb = new Boid(Helper.generateOffset(boid.r).add(boid.position), 8, 10));
                newb.health = math.max(boid.health, boid.DEF_HEALTH);
                newb.genome = math.clone(boid.genome);
                newb.mutate();
            }
            boid.health = -10;
        }
        if (boid.health <= 0) {
            if (boid.health > -10)
                food.push(boid.position);
            let index = boids.indexOf(boid);
            if (index > -1)
                boids.splice(index, 1);
        } else
            boid.draw();
    });
    food.forEach(position => {
        fill(color(4, 226, 19));
        stroke(0);
        ellipse(position.x, position.y, FOOD_SIZE);
    });
    if (food.length < 100 && math.random() <= 1 - food.length / 90)
        food.push(Helper.screenPoint(CANVAS_WIDTH, CANVAS_HEIGHT));
}

class Helper {
    static
    centerOfMass(points) {
        let sum = createVector(0, 0);
        for (const point of points)
            sum.add(point);
        return sum.div(points.length);
    }

    static
    generateOffset(radius) {
        return createVector(math.randomInt(-1, 1) * math.random(radius, 2 * radius), math.randomInt(-1, 1) * math.random(radius, 2 * radius));
    }

    static
    screenPoint(Xmax, Ymax) {
        return createVector(math.random(50, Xmax - 50), math.random(50, Ymax - 50));
    }
}