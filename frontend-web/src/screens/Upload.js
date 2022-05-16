import { Bucket, File } from '../components'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export const Upload = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Bucket />
      </div>
    </DndProvider>
  )
}