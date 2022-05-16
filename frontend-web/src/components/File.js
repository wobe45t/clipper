import { useDrag } from 'react-dnd'

export const File = (props) => {
  const { name } = props
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: 'BOX',
    item: { name },
    end: () => {
      console.log('end')
    },
    options: {
      dropEffect: () => {
        console.log('dropEffect')
      }
    }
  }))

  return collected.isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <div ref={drag} {...collected}>
      {name}
    </div>
  )
}
