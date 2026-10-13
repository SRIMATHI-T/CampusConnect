import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, UserRound } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form,setForm] = useState({email:'',password:''}); const [errors,setErrors] = useState({}); const [message,setMessage] = useState(''); const [busy,setBusy] = useState(false); const [show,setShow] = useState(false);
  const change = e => { setForm({...form,[e.target.name]:e.target.value}); setErrors({...errors,[e.target.name]:''}); setMessage(''); };
  async function submit(e) {
    e.preventDefault(); const next={};
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email='Enter a valid email address.';
    if(!form.password) next.password='Password is required.';
    setErrors(next); if(Object.keys(next).length) return;
    setBusy(true); setMessage('');
    try { const user=await login(form.email,form.password); const target=location.state?.from?.pathname; navigate(target || (user.role==='admin'?'/admin':'/dashboard'),{replace:true}); }
    catch(err){setMessage(err.message);} finally{setBusy(false);}
  }
  return <AuthShell title="Welcome back." subtitle="Sign in to get back to your campus." mode="login"><form className="auth-form" onSubmit={submit} noValidate>
    {message && <div className="form-alert" role="alert">{message}</div>}
    <Field label="Email address" name="email" type="email" value={form.email} onChange={change} error={errors.email} icon={<Mail size={17}/>} placeholder="you@college.edu" autoComplete="email"/>
    <Field label="Password" name="password" type={show?'text':'password'} value={form.password} onChange={change} error={errors.password} icon={<LockKeyhole size={17}/>} placeholder="Enter your password" autoComplete="current-password" trailing={<button type="button" className="field-eye" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button>}/>
    <div className="form-row"><span className="form-hint">Your account is protected.</span><span className="form-hint">Need help? Contact your campus admin.</span></div>
    <button className="button button-primary auth-submit" disabled={busy}>{busy?'Signing in…':'Sign in'} <ArrowRight size={17}/></button>
    <p className="auth-switch">New to CampusConnect? <Link to="/signup">Create an account</Link></p>
  </form></AuthShell>;
}
export function Signup() {
  const { register }=useAuth(); const navigate=useNavigate();
  const [form,setForm]=useState({name:'',email:'',password:'',confirm:''}); const [errors,setErrors]=useState({}); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false); const [show,setShow]=useState(false);
  const change=e=>{setForm({...form,[e.target.name]:e.target.value});setErrors({...errors,[e.target.name]:''});setMessage('');};
  async function submit(e){e.preventDefault();const next={};if(form.name.trim().length<2)next.name='Enter your full name.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))next.email='Enter a valid email address.';if(form.password.length<8)next.password='Use at least 8 characters.';if(form.password.length>128)next.password='Password is too long.';if(form.confirm!==form.password)next.confirm='Passwords do not match.';setErrors(next);if(Object.keys(next).length)return;setBusy(true);try{await register(form.name.trim(),form.email,form.password);navigate('/dashboard',{replace:true});}catch(err){setMessage(err.message);}finally{setBusy(false);}}
  return <AuthShell title="Make campus yours." subtitle="Create your student account to stay in the loop." mode="signup"><form className="auth-form" onSubmit={submit} noValidate>
    {message&&<div className="form-alert" role="alert">{message}</div>}
    <Field label="Full name" name="name" value={form.name} onChange={change} error={errors.name} icon={<UserRound size={17}/>} placeholder="Your full name" autoComplete="name"/>
    <Field label="Email address" name="email" type="email" value={form.email} onChange={change} error={errors.email} icon={<Mail size={17}/>} placeholder="you@college.edu" autoComplete="email"/>
    <Field label="Password" name="password" type={show?'text':'password'} value={form.password} onChange={change} error={errors.password} icon={<LockKeyhole size={17}/>} placeholder="At least 8 characters" autoComplete="new-password" trailing={<button type="button" className="field-eye" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button>}/>
    <div className="password-meter"><span className={form.password.length>=8?'meter-active':''}/><span className={form.password.length>=10?'meter-active':''}/><span className={/[A-Z]/.test(form.password)&&/[0-9]/.test(form.password)?'meter-active':''}/><small>{form.password.length===0?'Use 8 or more characters':form.password.length<8?'A little longer…':'Good length'}</small></div>
    <Field label="Confirm password" name="confirm" type="password" value={form.confirm} onChange={change} error={errors.confirm} icon={<LockKeyhole size={17}/>} placeholder="Re-enter password" autoComplete="new-password"/>
    <p className="form-hint">New accounts are created with student access. Administrator access is assigned separately.</p>
    <button className="button button-primary auth-submit" disabled={busy}>{busy?'Creating account…':'Create account'} <ArrowRight size={17}/></button>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </form></AuthShell>;
}
function Field({label,name,type='text',value,onChange,error,icon,placeholder,autoComplete,trailing}){return <div className={`field ${error?'field-invalid':''}`}><label htmlFor={name}>{label}</label><div className="input-wrap"><span className="input-icon">{icon}</span><input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error?`${name}-error`:undefined}/>{trailing}</div>{error&&<small className="field-error" id={`${name}-error`}>{error}</small>}</div>}
function AuthShell({title,subtitle,children,mode}){return <><Navbar/><main className="auth-page"><div className="auth-decoration auth-decoration-one"/><div className="auth-decoration auth-decoration-two"/><div className="auth-layout container"><div className="auth-aside"><Link to="/" className="back-home"><ArrowLeft size={15}/> Back to home</Link><div className="auth-aside-content"><span className="auth-emblem"><GraduationCap size={30}/></span><div className="eyebrow"><span className="eyebrow-dot"/> CAMPUS, IN YOUR CORNER</div><h1>Good things<br/>start <span>here.</span></h1><p>One connected space for campus updates, opportunities, and the people who make it all happen.</p><div className="auth-aside-foot"><span className="auth-check">✓</span><span>Campus news, all in one place</span></div></div></div><section className="auth-card"><div className="auth-card-head"><span className="auth-step">{mode==='login'?'WELCOME BACK':'GET STARTED'}</span><h2>{title}</h2><p>{subtitle}</p></div>{children}<div className="auth-privacy">Your information is handled securely.</div></section></div></main><Footer/></>}
