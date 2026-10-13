import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import { Login, Signup } from './pages/Auth';
import Dashboard from './pages/Dashboard';
function DefaultDashboard(){const {user}=useAuth();return <Navigate to={user?.role==='admin'?'/admin':'/dashboard'} replace/>;}
function AppRoutes(){return <Routes>
  <Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/>
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
  <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Dashboard adminOnly/></ProtectedRoute>}/>
  <Route path="/access-denied" element={<main className="not-found container"><h1>Access denied</h1><p>Your account does not have permission to open this page.</p><a className="button button-primary" href="/">Back home</a></main>}/>
  <Route path="*" element={<main className="not-found container"><span className="eyebrow dark-eyebrow">404 · PAGE NOT FOUND</span><h1>This page took a wrong turn.</h1><p>The page may have moved or the link may be incorrect.</p><a className="button button-primary" href="/">Back to home</a></main>}/>
</Routes>}
export default function App(){return <BrowserRouter><AuthProvider><AppRoutes/></AuthProvider></BrowserRouter>}
