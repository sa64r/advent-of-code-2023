import { parseLines, solve } from '../utils/typescript';

type State =
  | 'seed'
  | 'soil'
  | 'fertilizer'
  | 'water'
  | 'light'
  | 'temperature'
  | 'humidity'
  | 'location';

type Mapping = {
  sourceStart: number;
  destinationStart: number;
  range: number;
};

type Data = {
  seeds: number[];
  seedToSoil: Mapping[];
  soilToFertilizer: Mapping[];
  fertilizerToWater: Mapping[];
  waterToLight: Mapping[];
  lightToTemperature: Mapping[];
  temperatureToHumidity: Mapping[];
  humidityToLocation: Mapping[];
};

const parseInput = (input: string[]) => {
  // remove empty lines
  input = input.filter((line) => line !== '');
  const seeds = input[0].split('seeds: ')[1].split(' ');

  const data: Data = {
    seeds: seeds.map((seed) => parseInt(seed)),
    seedToSoil: [],
    soilToFertilizer: [],
    fertilizerToWater: [],
    waterToLight: [],
    lightToTemperature: [],
    temperatureToHumidity: [],
    humidityToLocation: [],
  };

  let entity:
    | 'seedToSoil'
    | 'soilToFertilizer'
    | 'fertilizerToWater'
    | 'waterToLight'
    | 'lightToTemperature'
    | 'temperatureToHumidity'
    | 'humidityToLocation'
    | undefined = undefined;

  for (let i = 1; i < input.length; i++) {
    const line = input[i];
    if (line.includes('map:')) {
      switch (line) {
        case 'seed-to-soil map:':
          entity = 'seedToSoil';
          break;
        case 'soil-to-fertilizer map:':
          entity = 'soilToFertilizer';
          break;
        case 'fertilizer-to-water map:':
          entity = 'fertilizerToWater';
          break;
        case 'water-to-light map:':
          entity = 'waterToLight';
          break;
        case 'light-to-temperature map:':
          entity = 'lightToTemperature';
          break;
        case 'temperature-to-humidity map:':
          entity = 'temperatureToHumidity';
          break;
        case 'humidity-to-location map:':
          entity = 'humidityToLocation';
      }
    } else {
      const [to, from, range] = line.split(' ');
      data[entity].push({
        sourceStart: parseInt(from),
        destinationStart: parseInt(to),
        range: parseInt(range),
      });
    }
  }

  return data;
};

const getSoilNumber = (seed: number, data: Data) => {
  for (const mapping of data.seedToSoil) {
    if (
      seed >= mapping.sourceStart &&
      seed < mapping.sourceStart + mapping.range
    ) {
      return seed - mapping.sourceStart + mapping.destinationStart;
    }
  }
  return seed;
};

const getFertilizerNumber = (soil: number, data: Data) => {
  for (const mapping of data.soilToFertilizer) {
    if (
      soil >= mapping.sourceStart &&
      soil < mapping.sourceStart + mapping.range
    ) {
      return soil - mapping.sourceStart + mapping.destinationStart;
    }
  }
  return soil;
};

const getWaterNumber = (fertilizer: number, data: Data) => {
  for (const mapping of data.fertilizerToWater) {
    if (
      fertilizer >= mapping.sourceStart &&
      fertilizer < mapping.sourceStart + mapping.range
    ) {
      return fertilizer - mapping.sourceStart + mapping.destinationStart;
    }
  }
  return fertilizer;
};

const getLightNumber = (water: number, data: Data) => {
  for (const mapping of data.waterToLight) {
    if (
      water >= mapping.sourceStart &&
      water < mapping.sourceStart + mapping.range
    ) {
      return water - mapping.sourceStart + mapping.destinationStart;
    }
  }
  return water;
};

const getTemperatureNumber = (light: number, data: Data) => {
  for (const mapping of data.lightToTemperature) {
    if (
      light >= mapping.sourceStart &&
      light < mapping.sourceStart + mapping.range
    ) {
      return light - mapping.sourceStart + mapping.destinationStart;
    }
  }
  return light;
};

const getHumidityNumber = (temperature: number, data: Data) => {
  for (const mapping of data.temperatureToHumidity) {
    if (
      temperature >= mapping.sourceStart &&
      temperature < mapping.sourceStart + mapping.range
    ) {
      return temperature - mapping.sourceStart + mapping.destinationStart;
    }
  }
  return temperature;
};

const getLocationNumber = (humidity: number, data: Data) => {
  for (const mapping of data.humidityToLocation) {
    if (
      humidity >= mapping.sourceStart &&
      humidity < mapping.sourceStart + mapping.range
    ) {
      return humidity - mapping.sourceStart + mapping.destinationStart;
    }
  }
  return humidity;
};

function part1(_input: string[]) {
  const parsedInput = parseInput(_input);

  const locations = parsedInput.seeds.map((seed) => {
    const soil = getSoilNumber(seed, parsedInput);
    const fertilizer = getFertilizerNumber(soil, parsedInput);
    const water = getWaterNumber(fertilizer, parsedInput);
    const light = getLightNumber(water, parsedInput);
    const temperature = getTemperatureNumber(light, parsedInput);
    const humidity = getHumidityNumber(temperature, parsedInput);
    const location = getLocationNumber(humidity, parsedInput);

    console.log(
      `seed: ${seed}, soil: ${soil}, fertilizer: ${fertilizer}, water: ${water}, light: ${light}, temperature: ${temperature}, humidity: ${humidity}, location: ${location}`,
    );

    return location;
  });

  return Math.min(...locations);
}

const getSeedRanges = (seeds: number[]): number[][] => {
  const seedRanges = seeds.reduce((acc, seed, index) => {
    if (index % 2 === 0) {
      acc.push([seed]);
    } else {
      acc[acc.length - 1].push(seed);
    }
    return acc;
  }, []);
  return seedRanges;
};

function part2(_input: string[]) {
  const parsedInput = parseInput(_input);
  const { seeds } = parsedInput;

  const seedRanges = getSeedRanges(seeds);

  let lowestLocation = Infinity;

  for (const seedRange of seedRanges) {
    const start = seedRange[0];
    const end = seedRange[1] + seedRange[0];
    for (let i = start; i < end; i++) {
      const soil = getSoilNumber(i, parsedInput);
      const fertilizer = getFertilizerNumber(soil, parsedInput);
      const water = getWaterNumber(fertilizer, parsedInput);
      const light = getLightNumber(water, parsedInput);
      const temperature = getTemperatureNumber(light, parsedInput);
      const humidity = getHumidityNumber(temperature, parsedInput);
      const location = getLocationNumber(humidity, parsedInput);
      lowestLocation = Math.min(lowestLocation, location);
    }
  }

  return lowestLocation;
}

solve({ part1, part2, parser: parseLines(), test2: 46 });
