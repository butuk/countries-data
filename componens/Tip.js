export class Tip {
  constructor(data, ...names) {
    this.data = Object.values(data);
    this.text = '';
    for (let index = 0; index < names.length; index++) {
      this.text += names[index] + ': ' + this.data[index] + '\n';
    }
    console.log(this.text);
  }

  render(place) {
    console.log(this.data);
    const div = document.createElement('div');
    div.classList.add('tooltip');
    div.innerText = this.text;
    document.querySelector(place).append(div);
  }

  delete() {
    document.querySelector('.tooltip').remove();
  }
}