import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages';
import Discover from './pages/discover';
import Mint from './pages/mint';
import Profile from './pages/profile';
import NavigationBar from './components/NavigationBar';

function App() {
    return (
        <Router>
        <NavigationBar />
        <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/Discover' element={<Discover/>} />
            <Route path='/Mint' element={<Mint/>} />
            <Route path='/Profile' element={<Profile/>} />
        </Routes>
        </Router>
    );
}
  
export default App;