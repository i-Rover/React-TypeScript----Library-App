import React from 'react';
import './App.css';
import {Carousel} from './Layouts/HomePage/Carousel';
import {Navbar} from './Layouts/NavbarAndFooter/Navbar';
import {ExploreTopBooks} from './Layouts/HomePage/ExploreTopBooks';
function App(){
  return (
    <div>
      <Navbar />
      <ExploreTopBooks />
      <Carousel />
    </div>
  );
}

export default App;
