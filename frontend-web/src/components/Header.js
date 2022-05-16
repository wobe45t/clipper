import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './styles/Header.style.css'
import {userAtom} from '../state'
import {useRecoilState} from 'recoil'

export const Header = () => {
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userAtom)

  const handleAuth = () => {
    console.log(user)
    // if(user.access_token) {
    console.log('removing')
    localStorage.removeItem('session')
    navigate('/')
    setUser({})
    // }
  }

  return (
    <div className='header'>
      <NavGroup>
        <NavItem>
          <MLink to='/upload'>Create playlist</MLink>
        </NavItem>
        <NavItem>
          <MLink to='/export'>Export bookmarks</MLink>
        </NavItem>
      </NavGroup>
      <NavGroup>
        {user && user.access_token && 
        <NavItem>
          <div onClick={handleAuth}>Logout</div>
        </NavItem>
        }
      </NavGroup>
    </div>
  )
}

const MLink = (props) => {
  const { to, children } = props

  return (
    <Link className='link' to={to}>
      {children}
    </Link>
  )
}

const NavItem = (props) => {
  const { children } = props
  return <div className='nav-item'>{children}</div>
}

const NavGroup = (props) => {
  const { children } = props

  return <div className='nav-group'>{children}</div>
}
