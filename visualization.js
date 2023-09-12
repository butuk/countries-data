'use strict';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {Scale} from './componens/Scale.js';
import {Axis} from "./componens/Axis.js";
import {Text} from "./componens/Text.js";
import {Range} from "./componens/Range.js";
import {Interval} from "./componens/Interval.js";
import {Svg} from "./componens/Svg.js";
import {SvgGroup} from "./componens/SvgGroup.js";
import {Tip} from "./componens/Tip.js";
import {LegendItem} from "./componens/LegendItem.js";
import {format} from "./componens/format.js";
import {Filter} from "./componens/Filter.js";

//Data source
const dataPath = 'data.json';

//Sizing
const VIZ = {WIDTH: 600, HEIGHT: 350, MARGIN: {LEFT: 20, TOP: 0, RIGHT: 0, BOTTOM: 25,}};
const width = VIZ.WIDTH - VIZ.MARGIN.LEFT - VIZ.MARGIN.RIGHT;
const height = VIZ.HEIGHT - VIZ.MARGIN.TOP - VIZ.MARGIN.BOTTOM;

//Visualization details
const ticksX = 5;                       //Amount of ticks on x-axis
const ticksY = 3;                       //Amount of ticks on y-axis
const axisBaseY = 3;                    //Base for axis with log scale (Income range on y-axis)
const sizeFrom = 2;                     //Smallest circle size
const sizeTo = 5000;                    //Biggest circle size
const opacity = .8;                     //Circles opacity
const colorScale = d3.schemeAccent;     //Color range. Source: https://github.com/d3/d3-scale-chromatic

//Time and timer variables
const initial = 1800;
const start = 0;
let time = start;
const speed = 100; //Time speed. In milliseconds
const duration = speed - 1; //Animation speed

//Canvas
const svg = new Svg(VIZ.WIDTH, VIZ.HEIGHT, 'canvas').render('#container')
const vis = new SvgGroup('viz').render(svg, VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP);

const h1 = document.querySelector('h1');

//Adding text
new Text('GDP per capita, $', 'labelY').render(svg, 0, 0);
new Text('Life expectancy, years', 'labelX').render(svg, (VIZ.MARGIN.LEFT + width), ((VIZ.MARGIN.TOP + height + VIZ.MARGIN.BOTTOM)));
const year = new Text(initial + start, 'year').render(vis, width, 0);

//Timer will be controlled by clicking the canvas
const controller = document.querySelector('.canvas');

let tip;
const filteredBy = '';

//Loading data and render visualization
d3.json(dataPath).then(dataset => {

    const data = dataset.map(element => {
        return element['countries'].filter(country => {
            return (country.income && country.life_exp && country.population);
        }).map(country => {
            country.income = Number(country.income);
            country.life_exp = Number(country.life_exp);
            country.population = Number(country.population);
            return country;
        });
    });

    const range = new Range(data);

    //Set scales
    const lifeScale = new Scale('linear', range.get('life_exp'), 0, width);
    const incomeScale = new Scale('log', range.get('income'), height, 0, axisBaseY);
    const populationScale = new Scale('linear', range.get('population'), sizeFrom, sizeTo);
    const continentScale = new Scale('ordinal', range.get('continent'), colorScale);

    const scalesArr = [lifeScale, incomeScale, populationScale, continentScale];

    //Render axis
    new Axis(incomeScale).render(svg, VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP, 'right', ticksY);
    new Axis(lifeScale).render(svg, VIZ.MARGIN.LEFT, (VIZ.MARGIN.TOP + height), 'top', ticksX);

    //Build legend
    buildLegend(data, range.get('continent'), colorScale);

    const filter = new Filter(data, continent, false);
    filter.render(h1, '.legend-item');

    //Change visualization by interval
    new Interval(renderVizByInterval(data, scalesArr, data.length)).run(speed).control(controller);

    //Render viz for the first time
    renderViz(data[start], scalesArr);

}).catch(error => {
    console.log(error);
});

//Building legend and make it to be a filter also
function buildLegend(data, items, colors) {
    const continentColor = new Scale('ordinal', [], colors);
    items.forEach((item, index) => {
        const legendItem = new LegendItem(item, index).render(continentColor);
        legendItem.dataset.item = `${item}`;

        const v = index === 0 ? 'in ' : '';
        const comma = (index !== items.length - 1) ? ',' : '';
        const text = document.createTextNode((`${v}${item}${comma}`));

        legendItem.append(text);
        h1.append(legendItem);
        index < items.length - 1 ? h1.append(' ') : null;

        //legendItem.addEventListener('click', applyFilter);
    })
}

//Rendering visualization by interval
function renderVizByInterval(data, scalesArr, amountOfTimes) {
    return () => {
        time = (time < amountOfTimes - 1) ? time + 1 : start;
        renderViz(data[time], scalesArr)
        year.text(String(time + initial));
    }
}

//Rendering visualization
function renderViz(data, [x, y, area, color]) {
    const t = d3.transition().duration(duration);

    const readyData = data;
    //filtered ? filterData(data, filteredBy) : data;

    const points = vis.selectAll('circle')
      .data(readyData, d => d.country); // d => d.country
    points.exit().remove();
    points.enter().append('circle')
        .attr('opacity', opacity)
        .on('mouseover', showTip)
        .on('mouseout', hideTip)
        .merge(points)
            .transition(t)
                .attr('cx', d => x(d.life_exp))
                .attr('cy', d => y(d.income))
                .attr('r', d => (Math.sqrt(area(d.population)/Math.PI)))
                .attr('fill', d => color(d.continent))

}

//Show tooltip on mouse hover
function showTip(event) {
    const target = event.target;
    const data = target['__data__'];
    tip = new Tip(data,['Continent', 'Country', 'GDP per capita', 'Life Expectancy', 'Population'], [format.firstLetterBig, null, format.moneyTalk, format.yearsRound, format.populationNumber]);
    tip.render(document.body, `${event.clientX}px`, `${event.clientY}px`);
    target.classList.add('outlined');
}

function hideTip(event) {
    event.target.classList.remove('outlined');
    tip.delete();
}


/*//Filter related events
function applyFilter(event) {
    const parameter = event.target;
    filteredBy = parameter.dataset.item;
    showResetFilterButton();
    dimOtherButtons(parameter, '.legend-item', '.filter-reset');
    parameter.classList.add('selected');
    return filtered = true;
}

function resetFilter() {
    upLightButtons('.legend-item');
    hideFilterButton();
    return filtered = false;
}

function showResetFilterButton() {
    const all = document.createElement('span');
    all.classList.add('filter-reset');
    all.classList.add('legend-item');

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
    document.querySelectorAll('.legend-item').forEach(item => {
        item.classList.remove('dimmed');
        item.classList.remove('selected');
    })
}

//Filter data
function filterData(data, continent) {
    return data.filter(country => {
            return country.continent === continent;
        })
}*/

