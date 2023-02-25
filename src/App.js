import logo from './logo.svg';
import './App.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';

function App() {

  const initData = [
    {
      id: 1,
      title: "Backlog",
      cards: [
        {
          id: 1,
          title: "Card title 1",
          content: "Card content"
        },
        {
          id: 2,
          title: "Card title 2",
          content: "Card content"
        },
        {
          id: 3,
          title: "Card title 3",
          content: "Card content"
        }
      ]
    },
    {
      id: 2,
      title: "In Progress",
      cards: [
        {
          id: 4,
          title: "Card title 4",
          content: "Card content"
        }
      ]
    },
    {
      id: 3,
      title: "Q&A",
      cards: [
        {
          id: 5,
          title: "Card title 5",
          content: "Card content"
        },
        {
          id: 11,
          title: "Card title 6",
          content: "Card content"
        }
      ]
    },
    {
      id: 4,
      title: "UAT",
      cards: [
        {
          id: 7,
          title: "Card title 7",
          content: "Card content"
        },
        {
          id: 8,
          title: "Card title 8",
          content: "Card content"
        }
      ]
    },
    {
      id: 5,
      title: "Production",
      cards: [
        {
          id: 9,
          title: "Card title 9",
          content: "Card content"
        },
        {
          id: 10,
          title: "Card title 10",
          content: "Card content"
        }
      ]
    }
  ]

  const [data, setData] = useState(initData)


  const reorder = (src, from, to) => {
    console.log(src, from, to)
    let arr = JSON.parse(JSON.stringify(src));
    let item = arr.splice(from, 1)[0]
    arr.splice(to, 0, item)
    return arr
  }

  const move = (src, dest, srcIdx, destIdx) => {
    console.log(src, dest, srcIdx, destIdx)
    let srcClone = JSON.parse(JSON.stringify(src));
    let destClone = JSON.parse(JSON.stringify(dest));
    let item = srcClone.splice(srcIdx, 1)[0]
    destClone.splice(destIdx, 0, item)
    console.log(destClone)
    return { src: srcClone, dest: destClone }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(source, destination)
    if (!destination) { // outside the list
      return
    }
    if (source.droppableId === destination.droppableId) { // same column
      let idx = parseInt(source.droppableId)
      const result = reorder(data[idx].cards, source.index, destination.index)
      setData((prevData) => prevData.map((e, i) => {
        if (i == idx) {
          return { ...e, cards: result }
        } else {
          return e
        }
      }))
    } else { // different column
      let srcIdx = parseInt(source.droppableId)
      let destIdx = parseInt(destination.droppableId)
      const result = move(data[srcIdx].cards, data[destIdx].cards, source.index, destination.index)
      console.log(result)
      setData((prevData) =>
        prevData.map((e, i) => {
          if (i == srcIdx) {
            return { ...e, cards: result.src }
          } else if (i === destIdx) {
            return { ...e, cards: result.dest }
          } else {
            return e
          }
        })
      )
    }


  }


  return (
    <div className="container">
      <DragDropContext onDragEnd={onDragEnd}>
        {data.map((col, colIdx) => (
          <Droppable key={colIdx} droppableId={colIdx.toString()} >
            {(provided, snapshop) => (
              <div ref={provided.innerRef}  {...provided.droppableProps} style={{ padding: 10, paddingRight: 20, paddingLeft: 20, margin: 10 }} className="container column card-container">
                <p className='title'>{col.title}</p>
                {col.cards.map((card, cardIdx) => (
                  <Draggable key={card.id} draggableId={card.id.toString()} index={cardIdx}>
                    {(provided, snapshop) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ width: "100%", marginBottom: 10, ...provided.draggableProps.style }}
                      >
                        <div style={{ padding: 10 }} className="card">
                          <p className='title'>{card.title}</p>
                          <div className='divider'></div>
                          <div className='content'>
                            {card.content}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}



export default App;
