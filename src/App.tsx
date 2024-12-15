import {
  CSSProperties,
  PointerEvent,
  useEffect,
  useState,
} from 'react';
import './App.scss';

import {
  noteNames,
  noteStacks,
  noteStackInfo,
} from './notes';

function App() {
  const [ballStyle, setBallStyle] = useState<CSSProperties>(
    { left: 0 }
  );
  const [xStartOffset, setXStartOffset] =
    useState<number>();
  const [inputX, setInputX] = useState(0);
  const [noteIndex, setNoteIndex] = useState(-1);

  const pointerDownHandler = (
    e: PointerEvent<HTMLDivElement>
  ) => {
    console.log('pointerDownHandler');
    setXStartOffset(e.clientX - inputX);
  };

  const pointerMoveHandler = (
    e: PointerEvent<HTMLDivElement>
  ) => {
    if (xStartOffset === undefined) return;
    const ballX = e.clientX;
    let newInputX = ballX - xStartOffset;
    const inputWidth =
      document.getElementById('inputrail')!.offsetWidth;
    if (newInputX > inputWidth) newInputX = inputWidth;
    if (newInputX < 0) newInputX = 0;
    setInputX(newInputX);
  };

  const pointerOutHandler = () => {
    setXStartOffset(undefined);
  };

  useEffect(() => {
    const width =
      document.getElementById('inputrail')!.offsetWidth;
    const pctg = (inputX / width) * 100;
    setBallStyle({ left: `${pctg}%` });
    setNoteIndex(
      Math.floor((pctg / 100) * noteNames.length - 1)
    );
  }, [inputX]);

  const noteStack: noteStackInfo = noteStacks[noteIndex]
    ? noteStacks[noteIndex]
    : { data: [], count: 0 };

  return (
    <div className='container'>
      <div className='barchart'>
        {noteNames.map((note, index) => {
          const pctg = noteStack.data[index]
            ? noteStack.data[index].pctg
            : 0;
          const reps = noteStack.data[index]
            ? noteStack.data[index].reps
            : 0;
          const width = pctg + '%';
          return (
            <div
              className='barchart__note'
              key={note}
              style={{ width: width }}
            >
              <p>
                <span>{note}</span>{reps > 0 ? reps : ''}
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
        <h2>4x kvarttipinot</h2>
        <p>
          top note:<span>{noteNames[noteIndex]}</span>
        </p>
        <p>
          notes:<span>{noteStack.count}</span>
        </p>
      </div>
    </div>
  );
}

export default App;
