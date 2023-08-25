'use strict';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {Scale} from './componens/Scale.js';
import {Axis} from "./componens/Axis.js";
import {Text} from "./componens/Text.js";
import {Range} from "./componens/Range.js";
import {Interval} from "./componens/Interval.js";
import {Canvas} from "./componens/Canvas.js";

//Data source
const dataPath = 'data.json';

//Sizing
const VIZ = {
    WIDTH: 600,
    HEIGHT: 350,
    MARGIN: {
        LEFT: 20,
        TOP: 0,
        RIGHT: 0,
        BOTTOM: 25,
    }
};
const width = VIZ.WIDTH - VIZ.MARGIN.LEFT - VIZ.MARGIN.RIGHT;
const height = VIZ.HEIGHT - VIZ.MARGIN.TOP - VIZ.MARGIN.BOTTOM;

//Visualization details
const ticksX = 5;                       //Amount of ticks on x-axis
const ticksY = 3;                       //Amount of ticks on y-axis
const axisBaseY = 3;                    //Base for axis with log scale (Income range on y-axis)
const sizeFrom = 1;                     //Smallest circle size
const sizeTo = 13000;                   //Biggest circle size
const opacity = .7;                     //Circles opacity
const colorScale = d3.schemeAccent;  //Color range. Source: https://github.com/d3/d3-scale-chromatic

//Time and timer variables
const initial = 1800;
const start = 0;
let time = start;
const speed = 100; // in milliseconds

//Canvas
const svg = new Canvas(VIZ.WIDTH, VIZ.HEIGHT).render('#container');
const vis = svg.addGroup(VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP);

// Timer will be controlled by clicking the canvas
const controller = document.querySelector('svg');

//Adding text
const year = new Text(initial + start).render(svg.block, 'year', (VIZ.MARGIN.LEFT + width), VIZ.MARGIN.TOP);
new Text('Income').render(svg.block, 'labelY', 0, 0);
new Text('Life expectancy').render(svg.block, 'labelX', (VIZ.MARGIN.LEFT + width), ((VIZ.MARGIN.TOP + height + VIZ.MARGIN.BOTTOM)));

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
    new Axis(incomeScale).render(svg.block, VIZ.MARGIN.LEFT, VIZ.MARGIN.TOP, 'right', ticksY);
    new Axis(lifeScale).render(svg.block, VIZ.MARGIN.LEFT, (VIZ.MARGIN.TOP + height), 'top', ticksX);

    //Build legend
    buildLegend(range.get('continent'), colorScale);

    //Change visualization by interval
    new Interval(renderVizByInterval(data, scalesArr, data.length)).run(speed).control(controller);

    //Render viz for the first time
    renderViz(data[start], scalesArr);

}).catch(error => {
    console.log(error);
});

//Building legend
function buildLegend(items, colors) {
    const continentColor = new Scale('ordinal', [], colors);
    items.forEach((item, index) => {
        item = item.slice(0,1).toUpperCase() + item.slice(1,item.length);
        const h1 = document.querySelector('h1');
        const comma = (index !== items.length - 2 && index !== items.length - 1) ? ',' : '';
        const and = index === items.length - 1 ? ' and ' : '';
        const legendItem = document.createElement('span');
        const text = document.createTextNode((`${and}${item}${comma} `));
        legendItem.append(text);
        legendItem.style.color = continentColor(item);
        h1.append(legendItem);
    })
}

//Rendering visualization by interval
function renderVizByInterval(data, scalesArr, amountOfTimes) {
    return () => {
        time = (time < amountOfTimes) ? time + 1 : start;
        renderViz(data[time], scalesArr)
        year.block.text(String(time + initial));
    }
}

//Rendering visualization
function renderViz(data, [x, y, area, color]) {
    const points = vis.block.selectAll('circle').data(data);
    points.exit().remove();
    points.enter().append('circle')
        .attr('opacity', opacity)
        .merge(points)
        .attr('cx', d => x(d.life_exp))
        .attr('cy', d => y(d.income))
        .attr('r', d => (Math.sqrt(area(d.population)/Math.PI)))
        .attr('fill', d => color(d.continent));
}