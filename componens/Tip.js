export class Tip {
  constructor(data, ...names) {
    this.data = Object.values(data);
    console.log(this.data);
    for (let index = 0; index < names.length; index++) {
      console.log(names[index]);
    }
  }

  render(place) {
    console.log(this.data);
    const div = document.createElement('div');
    div.classList.add('tooltip');

    /*this.data.forEach(element => {
      console.log(element);
      //div.innerText += element;
    })*/
    //place.append(div);
  }
}