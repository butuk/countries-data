'use strict';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {Scale} from './componens/Scale.js';
import {Axis} from "./componens/Axis.js";
import {Text} from "./componens/Text.js";
import {Range} from "./componens/Range.js";

//Data source
const dataPath = 'data.json';

//Sizing
const VIZ = {
    WIDTH: 600,
    HEIGHT: 400,
    MARGIN: {
        LEFT: 0,
        TOP: 0,
        RIGHT: 0,
        BOTTOM: 0,
    }
};
const width = VIZ.WIDTH - VIZ.MARGIN.LEFT - VIZ.MARGIN.RIGHT;
const height = VIZ.HEIGHT - VIZ.MARGIN.TOP - VIZ.MARGIN.BOTTOM;

//Items sizes
const sizeFrom = 1;
const sizeTo = 6500;

//Base for axis with log scale (Income on y)
const axisBaseY = 3;

//Color scale
const colorScale = d3.schemeTableau10; // source: https://github.com/d3/d3-scale-chromatic

//Time and timer variables
let dynamics = true;
const start = 0;
const initial = 1800;
let time = start;
const speed = 100;

//Canvas
const svg = d3.select('#container')
    .append('svg')
    .attr('width', VIZ.WIDTH)
    .attr('height', VIZ.HEIGHT)
    .attr('viewBox', `0 0 ${VIZ.WIDTH} ${VIZ.HEIGHT}`)
    .attr('preserveAspectRatio', 'xMinYMin meet')
const vis = svg.append('g')
    .attr('transform', `translate(${VIZ.MARGIN.LEFT} ${VIZ.MARGIN.TOP})`)

//Adding text
const year = new Text(initial).render(svg, 'year', (VIZ.MARGIN.LEFT + width), VIZ.MARGIN.TOP);
new Text('Income').render(svg, 'labelY', 50);

//Loading data and draw visualization
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

    //Draw axis
    new Axis(incomeScale).render(svg, VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP, 'right', 3);
    new Axis(lifeScale).render(svg, VIZ.MARGIN.LEFT, (VIZ.MARGIN.TOP + height), 'top', 5);

    //Draw legend
    buildLegend(range.get( 'continent'));

    //Change visualization by interval
    let interval = d3.interval(drawVizByInterval(data, scalesArr, data.length), speed);
    controlInterval(interval, document.querySelector('svg'), drawVizByInterval(data, scalesArr, data.length), speed);

    //Draw viz for the first time
    drawViz(data[0], ...scalesArr);

}).catch(error => {
    console.log(error);
});
//Createing legend
const continentColor = d3.scaleOrdinal(colorScale);
function buildLegend(items) {
    items.forEach((item, index) => {
        const h1 = document.querySelector('h1');
        let comma = index === items.length - 1 ? '.' : ',';
        const legendItem = document.createElement('span');
        const text = document.createTextNode((`${item}${comma} `));
        legendItem.append(text);
        legendItem.style.color = continentColor(item);
        h1.append(legendItem);
    })
}

//Make interval controlled by element
function controlInterval(timer, element, callback, speed) {
    element.addEventListener('click', () => {
        if (dynamics) {
            timer.stop();
            clearInterval(timer);
        } else {
            timer = d3.interval(callback, speed);
        }
        dynamics = !dynamics;
    })
}

//Create visualization by interval
function drawVizByInterval(data, scalesArr, amountOfTimes) {
    return () => {
        time = (time < amountOfTimes) ? time + 1 : start;
        drawViz(data[time], ...scalesArr)
        year.text(String(time + initial));
    }
}

//Create visualization
function drawViz(data, x, y, area, color) {
    const points = vis.selectAll('circle').data(data);
    points.exit().remove();
    points.enter().append('circle')
        .attr('opacity', 0.7)
        .merge(points)
        .attr('cx', d => x(d.life_exp))
        .attr('cy', d => y(d.income))
        .attr('r', d => (Math.sqrt(area(d.population)/Math.PI)))
        .attr('fill', d => color(d.continent));
}