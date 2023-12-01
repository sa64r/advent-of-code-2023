export async function aocFetch(path: string, year: number) {
  const res = await fetch(`https://adventofcode.com/${year}/${path}`, {
    headers: {
      cookie: `session=${process.env.SESSION}`,
    },
  });
  return res.text();
}
