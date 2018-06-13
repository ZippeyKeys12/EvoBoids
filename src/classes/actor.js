export default class Actor {
    constructor(position, mass, radius = 2.5) {
        this.position = position;
        this.r = radius;
        this.mass = mass;
    }
}