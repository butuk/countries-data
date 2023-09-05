export class Text {

  constructor(text, txtClass = null) {
    this.text = text;
    this.txtClass = txtClass;
  }

  render(place, x = 0, y = 0) {
    const where = place.append('g')
      .attr('transform', `translate(${x} ${y})`);

    this.block = where.append('text')
      .attr('class', `${this.txtClass} text`)
      .text(this.text)

    return this.block;
  }
}