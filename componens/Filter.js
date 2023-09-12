export class Filter  {
  constructor(props) {
    this
  }


  function applyFilter(event) {
  const parameter = event.target;
  filteredBy = parameter.dataset.item;
  showResetFilterButton();
  dimOtherButtons(parameter, '.filter-item', '.filter-reset');
  parameter.classList.add('selected');
  return filtered = true;
}

function resetFilter() {
  upLightButtons('.filter-item');
  hideFilterButton();
  return filtered = false;
}

function showResetFilterButton() {
  const all = document.createElement('span');
  all.classList.add('filter-reset');
  all.classList.add('filter-item');

  const divider = document.createElement('span');
  divider.classList.add('filter-reset');

  divider.textContent = ', ';
  all.textContent = 'all countries';

  if (!filtered) {
    h1.append(divider);
    h1.append(all);
  }
  all.addEventListener('click', resetFilter);
}

function hideFilterButton() {
  document.querySelectorAll('.filter-reset').forEach(item => {
    item.remove();
  })
}

function dimOtherButtons(button, ...className) {
  button.classList.remove('dimmed');
  button.classList.add('selected');
  className.forEach(name => {
    document.querySelectorAll(name).forEach(item => {
      item.classList.remove('selected');
      item !== button ? item.classList.add('dimmed') : null;
    });
  });
}

function upLightButtons(className) {
  document.querySelectorAll('.filter-item').forEach(item => {
    item.classList.remove('dimmed');
    item.classList.remove('selected');
  })
}

//Filter data
function filterData(data, continent) {
  return data.filter(country => {
    return country.continent === continent;
  })
}
}