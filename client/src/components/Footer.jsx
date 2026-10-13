import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Footer() { return <footer className="footer"><div className="container footer-main">
  <div><Link to="/" className="brand footer-brand"><span className="brand-icon"><GraduationCap size={22}/></span><span>campus<span className="brand-light">connect</span><small>YOUR CAMPUS, CONNECTED</small></span></Link><p className="footer-note">A simpler way to stay informed, involved, and connected to campus life.</p></div>
  <div><h4>Explore</h4><Link to="/">Home</Link><Link to="/login">Student login</Link><Link to="/signup">Create an account <ArrowUpRight size={13}/></Link></div>
  <div><h4>Stay connected</h4><p>Campus updates, notices and student services — all in one place.</p></div>
</div><div className="container footer-bottom"><span>© {new Date().getFullYear()} CampusConnect</span><span>Built for campus communities.</span></div></footer>; }
