export const noteNames = [
  'f#',
  'g',
  'g#',
  'a',
  'a#',
  'b',
  'c1',
  'c#1',
  'd1',
  'd#1',
  'e1',
  'f1',
  'f#1',
  'g1',
  'g#1',
  'a1',
  'a#1',
  'b1',
  'c2',
  'c#2',
  'd2',
  'd#2',
  'e2',
  'f2',
];

const noteStacksByIndex = (): number[][] => {
  const rs: number[][] = [];
  for (let i = 0; i < noteNames.length; i++) {
    const tmp: number[] = [];
    for (let j = 0; j <= i; j++) {
      for (let k = 0; k < 4; k++) {
        let fourthsDown = 0;
        while (j - k - fourthsDown * 5 >= 0) {
          const noteIndex = j - k - fourthsDown * 5;
          tmp[noteIndex] = tmp[noteIndex]
            ? tmp[noteIndex] + 1
            : 1;
          fourthsDown++;
        }
      }
    }
    rs.push(tmp);
  }
  return rs;
};

export type noteStackInfo = {
  data: { reps: number; pctg: number }[];
  count: number;
};

const noteStacksPercentage = (): noteStackInfo[] => {
  const ns = noteStacksByIndex();
  const max = ns.slice(-1)[0][0];
  return ns.map((stack) => {
    let count = 0;
    const data = stack.map((n) => {
      count += n;
      return {
        reps: n,
        pctg: Math.floor((n / max) * 10000) / 100,
      };
    });
    return { count, data };
  });
};

export const noteStacks = noteStacksPercentage();
