import {Polygon2D} from "../General/Polygon2D";
import {LevelConfig} from "./Level";

const GH = 1080
const GW = 1920

export const CONFIG_LEVEL_1: LevelConfig = {
    level: 1,
    stars: [550, 600, 800],
    fruits: [
        {type: "apple", position: [GW / 2, 400]},
        {type: "pear", position: [GW / 2 - 300, GH / 2 + 100]},
        {type: "banana", position: [GW / 2 + 300, GH / 2 + 100]}
    ],
    holes: [[GW - 300, GH - 300]],
    startPosition: [GW / 2, 200],
    polygons: [new Polygon2D([
        {x: 100, y: GH - 100},
        {x: 100, y: GH - 400},
        {x: 700, y: 400},
        {x: 700, y: 100},
        {x: GW - 700, y: 100},
        {x: GW - 700, y: 400},
        {x: GW - 100, y: GH - 400},
        {x: GW - 100, y: GH - 100},
        {x: GW - 400, y: GH - 100},
        {x: GW / 2, y: GH - 400},
        {x: 400, y: GH - 100},
    ])],
    antMountains: [{
        ants: 200,
        position: [250, GH - 250],
        offset: 20,
        delay: 0,
        speed: 3
    }],
    antCircles: [],
    bumpers: [
        {position: [420, 780], angle: -25},
        {position: [370, 680], angle: -25},

    ]
}

export const CONFIG_LEVEL_2: LevelConfig = {
    level: 2,
    stars: [750, 800, 1000],
    fruits: [
        {type: "apple", position: [300, GH / 2]},
        {type: "pear", position: [GW - 300, GH / 2]},
        {type: "apple", position: [GW / 2, GH / 2 - 100]},
        {type: "banana", position: [GW / 2, 250]}
    ],
    holes: [[300, GH - 300], [GW - 300, GH - 300]],
    startPosition: [GW / 2, GH / 2],
    polygons: [
        new Polygon2D([
            {x: 700, y: 500},
            {x: 700, y: 100},
            {x: GW - 700, y: 100},
            {x: GW - 700, y: 500},
            {x: GW - 700, y: 400},
            {x: GW - 100, y: 400},
            {x: GW - 100, y: GH - 100},
            {x: GW - 700, y: GH - 100},
            {x: GW - 700, y: GH - 300},
            {x: 700, y: GH - 300},
            {x: 700, y: GH - 100},
            {x: 100, y: GH - 100},
            {x: 100, y: 400},
            {x: 700, y: 400},
        ])],
    antMountains: [{
        ants: 200,
        position: [GW / 2, GH - 150],
        offset: 20,
        delay: 0,
        speed: 4
    }],
    antCircles: [],
    bumpers: [
        {position: [GW / 2, 120], angle: 90},
        {position: [720, 250], angle: 0},
        {position: [GW - 720, 250], angle: 0}
    ]
}

export const CONFIG_LEVEL_3: LevelConfig = {
    level: 3,
    stars: [2000, 2250, 2500],
    holes: [[GW / 2, 200]],
    startPosition: [GW / 2, GH - 250],
    polygons: [new Polygon2D([
        {x: 600, y: 100},
        {x: GW - 600, y: 100},
        {x: GW - 400, y: GH / 2 + 100},
        // Go a bit diagonally back
        {x: GW - 500, y: GH / 2 - 150},
        {x: GW - 200, y: GH / 2 - 150},
        {x: GW - 100, y: GH / 2},
        {x: GW - 100, y: GH - 200},
        {x: GW - 200, y: GH - 100},
        {x: 200, y: GH - 100},
        {x: 100, y: GH - 200},
        {x: 100, y: GH / 2},
        {x: 200, y: GH / 2 - 150},
        {x: 450, y: GH / 2 - 150},
        {x: 400, y: GH / 2 + 100},
    ]), new Polygon2D(([
        {x: GW / 2 - 100, y: GH / 2 - 150},
        {x: GW / 2 + 100, y: GH / 2 - 150},
        {x: GW / 2 + 250, y: GH / 2 + 150},
        {x: GW / 2 - 250, y: GH / 2 + 150}
    ]))],
    antMountains: [{
        ants: 200,
        position: [GW / 2, GH / 2],
        offset: 20,
        delay: 0,
        speed: 4
    }],
    antCircles: [{
        ants: 100,
        position: [GW / 2, GH / 2],
        radius: 350,
    }],
    fruits: [
        {type: "apple", position: [800, GH - 250]},
        {type: "apple", position: [680, GH - 720]},
        {type: "apple", position: [610, GH - 550]},
        {type: "apple", position: [540, GH - 380]},
        {type: "apple", position: [400, GH - 260]},
        {type: "apple", position: [280, GH/2]},
        {type: "apple", position: [250, GH/2 + 200]},
        // Same again symmetrical
        {type: "apple", position: [GW - 800, GH - 250]},
        {type: "apple", position: [GW - 680, GH - 720]},
        {type: "apple", position: [GW - 610, GH - 550]},
        {type: "apple", position: [GW - 540, GH - 380]},
        {type: "apple", position: [GW - 400, GH - 260]},
        {type: "apple", position: [GW - 280, GH/2]},
        {type: "apple", position: [GW - 250, GH/2 + 200]},
    ],
    bumpers: [
        {position: [GW / 2 - 130, 130], angle: 90},
        {position: [GW / 2, 130], angle: 90},
        {position: [GW / 2 + 130, 130], angle: 90},
        {position: [GW - 520, GH / 2 - 150], angle: -25},
        {position: [520, GH / 2 - 150], angle: 25},
        {position: [GW / 2 - 250, GH - 130], angle: 90},
        {position: [GW / 2 + 250, GH - 130], angle: 90},
        {position: [GW - 170, GH - 200], angle: 40},
        {position: [170, GH - 200], angle: -40},
    ]
}

export const CONFIG_LEVEL_4: LevelConfig = {
    level: 4,
    stars: [1800, 2000, 2500],
    fruits: [
        {type: "banana", position: [GW / 2, 175]},
        {type: "banana", position: [300, 500]},
        {type: "banana", position: [GW - 300, 500]},
        {type: "apple", position: [GW / 2 - 200, GH - 200]},
        {type: "apple", position: [GW / 2 + 200, GH - 200]}
    ],
    startPosition: [GW / 2, GH / 2],
    holes: [[350, 650], [GW - 350, 650], [GW / 2, GH / 2 - 250]],
    polygons: [new Polygon2D([
        {x: 450, y: 100},
        {x: GW - 450, y: 100},
        {x: GW - 450, y: 400},
        {x: GW - 100, y: 400},
        {x: GW - 100, y: GH - 300},
        {x: GW - 450, y: GH - 300},
        {x: GW - 450, y: GH - 100},
        {x: 450, y: GH - 100},
        {x: 450, y: GH - 300},
        {x: 100, y: GH - 300},
        {x: 100, y: 400},
        {x: 450, y: 400},
    ])],
    antMountains: [{
        ants: 100,
        position: [200, GH - 150],
        offset: 15,
        delay: 0,
        speed: 4
    }, {
        ants: 100,
        position: [GW - 200, GH - 150],
        offset: 15,
        delay: 50,
        speed: 4
    }],
    antCircles: [{
        ants: 50,
        position: [350, 650],
        radius: 250,
    }, {
        ants: 50,
        position: [GW - 350, 650],
        radius: 250,
    }, {
        ants: 50,
        position: [GW / 2, GH / 2 - 250],
        radius: 250,
    }],
    bumpers: [
        {position: [GW / 2, GH - 150], angle: 90},
        {position: [500, 250], angle: 0},
        {position: [GW - 500, 250], angle: 0},
        {position: [150, GH / 2 + 20], angle: 0},
        {position: [GW - 150, GH / 2 + 20], angle: 0}
    ]
}