export class Tip {
  constructor(data, [...names], [...funcs]) {
    this.data = Object.values(data);
    this.keys = Object.keys(data);
    //this.text = '';
    this.text = document.createElement('div');
    for (let index = 0; index < this.keys.length; index++) {
      let parameter = this.keys[index];
      names[index] ? parameter = names[index] : parameter;
      let paramSpan = document.createElement('span');
      paramSpan.innerText = parameter;

      let value = this.data[index];
      funcs[index] ? value = funcs[index](value) : value;
      let valueSpan = document.createElement('span');
      valueSpan.innerText = value;

      let row = document.createElement('div');
      if (parameter !== 'Continent' ) {
        if (parameter !== 'Country') {
          row.append(paramSpan);
          row.append(': ');
        }
      }
      row.append(valueSpan);

      parameter === 'Continent' ? valueSpan.classList.add('smallcaps') : null;
      parameter === 'Country' ? valueSpan.classList.add('emph') : null;

      this.text.append(row);
    }
    this.text.classList.add('tooltip');
  }

  render(place, x, y) {
    place.append(this.text);
    this.text.style.left = x;
    this.text.style.top = y;
  }

  delete() {
    document.querySelector('.tooltip').remove();
  }
}