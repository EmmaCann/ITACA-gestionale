// import React from 'react';
// import { Navbar } from '../components/navbar';
// import { TopBar } from '../components/topBar';
// import {FAB} from '../components/molecules/FAB.jsx';

// const Home = () => {
//     return (
//         <div className="bg-background flex w-screen h-screen flex-row">

//             <div className=''>
//                 <Navbar/>
//             </div>
//             <div className=' flex-1'>
//                 <div>
//                     <TopBar/>

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default Home;

import React from "react";
import { Navbar } from "../components/navbar";
import { TopBar } from "../components/topBar";
import { FAB } from "../components/molecules/FAB.jsx";

const Home = () => {
    return (
        <div className="bg-background flex w-screen h-screen flex-row overflow-x-hidden">
            {/* Navbar a sinistra */}
            <div>
                <Navbar />
            </div>

            <div className="flex-1 flex flex-col relative">
                <TopBar />

                <div className="flex-1 overflow-y-auto">

                    
                </div>
            </div>
        </div>
    );
};

export default Home;
