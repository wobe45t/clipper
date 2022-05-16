import './styles/Button.style.css'

export const Button = (props) => {
  const {onClick, children} = props

  return (
    <div className='button' onClick={onClick}>
      {children}
    </div>
  )

}