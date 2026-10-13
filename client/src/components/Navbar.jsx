import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth(); const [open, setOpen] = useState(false); const navigate = useNavigate();
  function signOut() { logout(); setOpen(false); navigate('/'); }
  return <header className="navbar"><div className="nav-inner container">
    <Link to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-icon"><GraduationCap size={22}/></span><span>campus<span className="brand-light">connect</span><small>YOUR CAMPUS, CONNECTED</small></span></Link>
    <button className="mobile-toggle icon-button" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    <nav className={`nav-links ${open ? 'nav-open' : ''}`}>
      <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
      {user && <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>}
      {user?.role === 'admin' && <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>}
      {user ? <><span className="nav-user">{user.name}</span><button className="button button-small button-quiet" onClick={signOut}><LogOut size={15}/> Sign out</button></> :
        <><Link to="/login" className="nav-login" onClick={() => setOpen(false)}>Log in</Link><Link to="/signup" className="button button-small" onClick={() => setOpen(false)}>Join Campus <ArrowUpRight size={15}/></Link></>}
    </nav>
  </div></header>;
}
