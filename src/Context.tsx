import { createContext, CSSProperties, Dispatch } from 'react';
import {
  generateNoteNames,
  generateNoteStacks,
  NoteStackInfo,
  NumNotesOption,
} from './notes';

type ProgramState = {
  ballStyle: CSSProperties;
  xStartOffset: number | undefined;
  inputX: number;
  noteIndex: number;
  numNotes: NumNotesOption;
  noteNames: string[];
  noteStacks: NoteStackInfo[];
};

type ReducerAction = {
  type:
    | 'SET_X_START_OFFSET'
    | 'UNSET_X_START_OFFSET'
    | 'SET_INPUT_X'
    | 'SET_NUM_NOTES';
  payload?: Partial<ProgramState>;
};

export const initialState = (): ProgramState => {
  const numNotes: NumNotesOption = 19;
  const noteNames = generateNoteNames(numNotes);
  const noteStacks = generateNoteStacks(noteNames);
  return {
    ballStyle: { left: 0 },
    xStartOffset: undefined,
    inputX: 0,
    noteIndex: -1,
    numNotes,
    noteNames,
    noteStacks,
  };
};

export const reducer = (
  state: ProgramState,
  action: ReducerAction
): ProgramState => {
  switch (action.type) {
    case 'SET_X_START_OFFSET': {
      return { ...state, xStartOffset: action.payload!.xStartOffset! };
    }
    case 'UNSET_X_START_OFFSET': {
      return { ...state, xStartOffset: undefined };
    }
    case 'SET_INPUT_X': {
      const inputWidth = document.getElementById('inputrail')!.offsetWidth;
      const inputX = action.payload!.inputX!;
      const pctg = (inputX / inputWidth) * 100;
      return {
        ...state,
        inputX,
        ballStyle: { left: `${pctg}%` },
        noteIndex: Math.floor((pctg / 100) * state.noteNames.length - 1),
      };
    }
    case 'SET_NUM_NOTES': {
      const inputWidth = document.getElementById('inputrail')!.offsetWidth;
      const numNotes = action.payload!.numNotes!;
      const noteNames = generateNoteNames(numNotes);
      const noteStacks = generateNoteStacks(noteNames);

      const newState = {
        ...state,
        numNotes,
        noteNames,
        noteStacks,
      };

      if (state.noteIndex > numNotes - 1) {
        // overflow
        newState.inputX = inputWidth;
        newState.ballStyle = { left: '100%' };
        newState.noteIndex = numNotes - 1;
      } else {
        if (state.noteIndex === -1) {
          newState.ballStyle = { left: '0%' };
          newState.inputX = 0;
        } else {
          // adjust slider to match reality
          const pctg = ((state.noteIndex + 1) / noteNames.length) * 100;
          newState.ballStyle = { left: `${pctg}%` };
          newState.inputX = (inputWidth * pctg) / 100;
        }
      }
      return newState;
    }
  }
};

export const Context = createContext<{
  state: ProgramState;
  dispatch: Dispatch<ReducerAction>;
}>({ state: initialState(), dispatch: () => {} });
