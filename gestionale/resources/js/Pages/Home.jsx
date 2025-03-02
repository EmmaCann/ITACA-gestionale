import React from 'react';
import { Navbar } from '../components/navbar';
import { TopBar } from '../components/topBar';

const Home = () => {
    return (
        <div className="bg-background flex w-screen h-screen flex-row">
           
            <div className=''>
                <Navbar/>
            </div>
            <div className=' flex-1'>
                <div>
                    <TopBar/>
                </div>
                
            </div>
          
        </div>
    );
};

export default Home;

