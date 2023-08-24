import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class Scale {
  constructor(type, ...args) {
    return this[type](...args);
  }

  linear(range, from, to) {
    return d3.scaleLinear()
      .domain(d3.extent(range))
      .range([from, to]);
  }

  log(range, from, to, base) {
    return d3.scaleLog()
      .domain(d3.extent(range))
      .range([from, to])
      .base(base);
  }

  ordinal(rangeIn, rangeOut) {
    return d3.scaleOrdinal()
      .domain(rangeIn)
      .range(rangeOut)
  }
}