export class Range {
  constructor(data) {
    this.data = data;
  }

  get(param) {
    const parameters = new Set();
    for (let element of this.data) {
      for (let country of element) {
        parameters.add(country[param]);
      }
    }
    return Array.from(parameters);
  }
}