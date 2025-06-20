import { PointerEvent, useContext } from 'react';
import './App.scss';

import { numNotesOptions } from './notes';
import Arrow from './Arrow';
import { Context } from './Context';

function App() {
  const { state, dispatch } = useContext(Context);
  const {
    ballStyle,
    xStartOffset,
    inputX,
    noteIndex,
    numNotes,
    noteNames,
    noteStacks,
  } = state;
  // const [ballStyle, setBallStyle] = useState<CSSProperties>({ left: 0 });
  // const [xStartOffset, setXStartOffset] = useState<number>();
  // const [inputX, setInputX] = useState(0);
  // const [noteIndex, setNoteIndex] = useState(-1);
  // const [numNotes, setNumNotes] = useState<NumNotesOption>(19);

  // const noteNames = generateNoteNames(numNotes);
  // const noteStacks = generateNoteStacks(noteNames);

  const pointerDownHandler = (e: PointerEvent<HTMLDivElement>) => {
    dispatch({
      type: 'SET_X_START_OFFSET',
      payload: { xStartOffset: e.clientX - inputX },
    });
    // setXStartOffset(e.clientX - inputX);
  };

  const pointerMoveHandler = (e: PointerEvent<HTMLDivElement>) => {
    if (xStartOffset === undefined) return;
    const ballX = e.clientX;
    let newInputX = ballX - xStartOffset;
    const inputWidth = document.getElementById('inputrail')!.offsetWidth;
    if (newInputX > inputWidth) newInputX = inputWidth;
    if (newInputX < 0) newInputX = 0;
    dispatch({ type: 'SET_INPUT_X', payload: { inputX: newInputX } });
    // setInputX(newInputX);
  };

  const pointerOutHandler = () => {
    dispatch({ type: 'UNSET_X_START_OFFSET' });
    // setXStartOffset(undefined);
  };

  // useEffect(() => {
  //   // When arrow is pressed and numnotes changed
  //   // Update slider or noteIndex accordingly
  //   const inputWidth = document.getElementById('inputrail')!.offsetWidth;

  //   console.log(numNotes, noteIndex);
  //   if (noteIndex > numNotes - 1) {
  //     // console.log(`setInputX(${inputWidth})`);
  //     // setInputX(inputWidth);
  //     console.log(`setInputX(480)`);
  //     setInputX(480);
  //   }
  //   if (noteIndex < numNotes - 1) {
  //     console.log(`${noteIndex} < (${numNotes} - 1),\n must update inputX`);
  //   }
  // }, [numNotes]);

  // useEffect(() => {
  // console.log(`inputX: ${inputX}`);
  // const width = document.getElementById('inputrail')!.offsetWidth;
  // const pctg = (inputX / width) * 100;

  // setBallStyle({ left: `${pctg}%` });
  // setNoteIndex(Math.floor((pctg / 100) * noteNames.length - 1));
  // }, [inputX]);

  const numNotesOptionIndex = numNotesOptions.indexOf(numNotes);

  const arrowHandler = (change: 1 | -1) => {
    const newIndex = numNotesOptionIndex + change;
    if (newIndex >= 0 && newIndex < numNotesOptions.length) {
      const numNotes = numNotesOptions[newIndex];
      dispatch({ type: 'SET_NUM_NOTES', payload: { numNotes } });
      // setNumNotes(newNumNotes);
    }
  };

  const noteStack = noteStacks[noteIndex]
    ? noteStacks[noteIndex]
    : { data: [], count: 0 };

  return (
    <div className='container'>
      <div
        className='barchart'
        style={{ fontSize: `calc(50vh / ${noteNames.length})` }}
      >
        {noteNames.map((note, index) => {
          const pctg = noteStack.data[index] ? noteStack.data[index].pctg : 0;
          const reps = noteStack.data[index] ? noteStack.data[index].reps : 0;
          const width = pctg + '%';
          const marbo =
            note.length === 2 && note[0] === 'c' ? '.6vh' : undefined;
          return (
            <div
              className='barchart__note'
              key={note}
              style={{ width: width, marginBottom: marbo }}
            >
              <p>
                <span
                  className='notename'
                  style={{ width: `calc(150vh / ${noteNames.length})` }}
                >
                  {note}
                </span>
                {reps > 0 ? reps : ''}
              </p>
            </div>
          );
        })}
      </div>
      <div className='input'>
        <div id='inputrail' className='input__rail'>
          <div
            id='inputball'
            className='input__ball'
            style={ballStyle}
            onPointerDown={(e) => pointerDownHandler(e)}
            onPointerMove={(e) => pointerMoveHandler(e)}
            onPointerOut={pointerOutHandler}
          ></div>
        </div>
      </div>
      <div className='info'>
        <h1>4x kvarttipinot</h1>
        <p>
          korkein ääni:
          <span className='notename'>{noteNames[noteIndex]}</span>
        </p>
        <p>
          ääniä:<span>{noteStack.count}</span>
        </p>
        <div className='upDown'>
          <div
            onClick={() => arrowHandler(1)}
            className={
              numNotesOptionIndex >= numNotesOptions.length - 1
                ? 'disabled'
                : ''
            }
          >
            <Arrow />
          </div>
          <div
            onClick={() => arrowHandler(-1)}
            className={numNotesOptionIndex === 0 ? 'disabled' : ''}
          >
            <Arrow />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
