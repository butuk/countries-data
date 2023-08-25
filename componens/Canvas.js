import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class Canvas {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

  render(place) {
    this.block = d3.select(place)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
    return this;
  }

  addGroup(x, y) {
    this.block.append('g').attr('transform', `translate(${x} ${y})`)
    return this;
  }
}