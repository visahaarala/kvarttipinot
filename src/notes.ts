export type NumNotesOption = 19 | 29 | 39 | 49;

export const numNotesOptions: NumNotesOption[] = [19, 29, 39, 49];

export const generateNoteNames = (numNotes: NumNotesOption): string[] => {
  const intervals = [2, 2, 1, 2, 2, 2, 1];
  const alphabets = 'cdefgab';
  const notes: string[] = alphabets
    .split('')
    .map((alphabet, index) =>
      intervals[index] === 2 ? [alphabet, alphabet + '#'] : alphabet
    )
    .flat();
  const noteNames: string[] = [];
  const lowestIndex = notes.indexOf('f#');
  for (let i = lowestIndex; i < lowestIndex + numNotes; i++) {
    const octave = Math.floor(i / notes.length);
    noteNames.push(notes[i % notes.length] + (octave === 0 ? '' : octave));
  }
  return noteNames;
};

const noteStacksByIndex = (noteNames: string[]): number[][] => {
  const rs: number[][] = [];
  for (let i = 0; i < noteNames.length; i++) {
    const tmp: number[] = [];
    for (let j = 0; j <= i; j++) {
      for (let k = 0; k < 4; k++) {
        let fourthsDown = 0;
        while (j - k - fourthsDown * 5 >= 0) {
          const noteIndex = j - k - fourthsDown * 5;
          tmp[noteIndex] = tmp[noteIndex] ? tmp[noteIndex] + 1 : 1;
          fourthsDown++;
        }
      }
    }
    rs.push(tmp);
  }
  return rs;
};

export type NoteStackInfo = {
  data: { reps: number; pctg: number }[];
  count: number;
};

export const generateNoteStacks = (noteNames: string[]): NoteStackInfo[] => {
  const ns = noteStacksByIndex(noteNames);
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
