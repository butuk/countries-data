export class Text {

  constructor(text) {
    this.text = text;
  }

  render(place, txtClass = null, x = 0, y = 0) {
    const where = place.append('g')
      .attr('transform', `translate(${x} ${y})`)

    return where.append('text')
      .attr('class', `${txtClass}`)
      .text(this.text)
  }
}