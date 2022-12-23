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
    level: 1,
    stars: [200, 300, 400],
    fruits: [{type: "apple", position: [400, 400]}, {type: "pear", position: [800, 500]}],
    holes: [[1100, 500]],
    startPosition: [540, 200],
    polygons: [new Polygon2D([
        {x: 100, y: 400},
        {x: 450, y: 400},
        {x: 450, y: 100},
        {x: 1920 - 450, y: 100},
        {x: 1920 - 450, y: 250},
        {x: 1920 - 100, y: 250},
        {x: 1920 - 100, y: 1080 - 100},
        {x: 100, y: 1080 - 100}
    ])],
    // antMountains: [{
    //     ants: 200,
    //     position: [200, 300],
    //     offset: 50,
    //     delay: 50
    // }],
    antMountains: [],
    antCircles: [{
        ants: 50,
        position: [800, 500],
        radius: 300,
    }],
    bumpers: [
        {position: [500, 600], angle: 90}
    ]
}

export const CONFIG_LEVEL_4: LevelConfig = {
    level: 1,
    stars: [200, 300, 400],
    fruits: [{type: "apple", position: [400, 400]}, {type: "pear", position: [800, 500]}],
    holes: [[1100, 500]],
    startPosition: [540, 200],
    polygons: [new Polygon2D([
        {x: 100, y: 400},
        {x: 450, y: 400},
        {x: 450, y: 100},
        {x: 1920 - 450, y: 100},
        {x: 1920 - 450, y: 250},
        {x: 1920 - 100, y: 250},
        {x: 1920 - 100, y: 1080 - 100},
        {x: 100, y: 1080 - 100}
    ])],
    // antMountains: [{
    //     ants: 200,
    //     position: [200, 300],
    //     offset: 50,
    //     delay: 50
    // }],
    antMountains: [],
    antCircles: [{
        ants: 50,
        position: [800, 500],
        radius: 300,
    }],
    bumpers: [
        {position: [500, 600], angle: 90}
    ]
}