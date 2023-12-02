import { parseLines, solve } from '../utils/typescript';

const parseInputArr = (_input: string[]) => {
  const input = _input.map((line) => {
    const [gameId, allDraws] = line.split(':');
    const id = parseInt(gameId.split(' ')[1], 10); // 1
    const draws = allDraws.split(';').map((draw) => draw.trim()); // ['3 blue, 1 green', '2 red, 1 blue'] etc
    const mappedDraws = draws.map((draw) => {
      const eachColor = draw.split(',').map((color) => color.trim());

      const mappedColors = eachColor.map((color) => {
        const [count, colorName] = color.split(' ');
        return { count: parseInt(count), color: colorName };
      });

      return mappedColors;
    });

    return { id, mappedDraws };
  });
  return input;
};

function part1(_input: string[]) {
  const input = parseInputArr(_input);

  const MAX_CUBES = {
    red: 12,
    green: 13,
    blue: 14,
  };

  // count ids for if all draws in a game are possible
  const possibleIds = input.filter((game) => {
    const possible = game.mappedDraws.every((draw) => {
      const possibleDraw = draw.every(({ count, color }) => {
        return count <= MAX_CUBES[color];
      });

      return possibleDraw;
    });

    return possible;
  });

  const sumOfIds = possibleIds.reduce((acc, { id }) => acc + id, 0);

  return sumOfIds;
}

function part2(_input: string[]) {
  const input = parseInputArr(_input);

  const productOfMaxCubesPerGame = input.map((game) => {
    const { mappedDraws } = game;

    const maxCubesForGame = {
      red: 0,
      green: 0,
      blue: 0,
    };

    mappedDraws.forEach((draw) => {
      draw.forEach(({ count, color }) => {
        if (count > maxCubesForGame[color]) {
          maxCubesForGame[color] = count;
        }
      });
    });

    const productOfMaxCubes = Object.values(maxCubesForGame).reduce(
      (acc, max) => acc * max,
      1,
    );

    return productOfMaxCubes;
  });

  const sumOfProducts = productOfMaxCubesPerGame.reduce(
    (acc, product) => acc + product,
    0,
  );

  return sumOfProducts;
}

solve({ part1, part2, parser: parseLines() });
