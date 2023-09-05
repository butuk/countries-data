export class Tip {
  constructor(data, [...names], [...funcs]) {
    this.data = Object.values(data);
    this.keys = Object.keys(data);
    this.text = '';
    for (let index = 0; index < this.keys.length; index++) {
      let parameter = this.keys[index];
      names[index] ? parameter = names[index] : parameter;
      let value = this.data[index];
      funcs[index] ? value = funcs[index](value) : value;
      this.text += parameter + ': ' + value + '\n';
    }
  }

  render(place, x, y) {
    const div = document.createElement('div');
    div.classList.add('tooltip');
    div.innerText = this.text;
    document.querySelector(place).append(div);
    div.style.left = x;
    div.style.top = y;
  }

  delete() {
    document.querySelector('.tooltip').remove();
  }
}