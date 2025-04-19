import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { Login, Employee } from './pages';

function App() {
  return (
    // <div className="App" asfasf>
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>np
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home</h1>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/employee' element={<Employee/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
