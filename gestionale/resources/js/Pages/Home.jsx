

import React from 'react';
import { LoginForm } from '../components/molecules/loginForm';
import { LogoItaca } from '../components/molecules/atoms/logoItaca';

const Home = () => {
    return (
        <div className="h-screen w-screen bg-background flex">
            
            {/* Sezione Sinistra */}
            <div className="  relative  flex w-[650px]  bg-transparent flex justify-center items-center">
               {/* Linee diagonali */}
               <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[280px] left-[-200px] w-[1000px] h-[3px] bg-[#484946] opacity-80 rotate-[-45deg] shadow-md"></div>
                    <div className="absolute top-[220px] left-[-200px] w-[1000px] h-[3px] bg-bluPrimary opacity-70 rotate-[-45deg] shadow-md"></div>
                    <div className="absolute top-[100px] left-[-200px] w-[1000px] h-[3px] bg-pinkPrimary opacity-70 rotate-[-45deg] shadow-md"></div>
                </div>
                <div className="  absolute bottom-8 left-[120px]">
                    <LogoItaca />
                </div>
            </div>

            {/* Sezione Destra */}
            <div className=" flex-1 flex-col  bg-transparent flex justify-center items-center ">
              
               <p className=" text-gray-600 italic w-full  pl-8 font-marcellusSC">
                    “Quando ti metterai in viaggio per Itaca<br />
                    devi augurarti che la strada sia lunga,<br />
                    fertile in avventure e in esperienze...”
                </p>

              
                <LoginForm />
                
                <p className="text-gray-600 italic w-full text-end mt-12 pr-8 font-marcellusSC ">
                    “Itaca ti ha dato il bel viaggio,<br />
                    senza di lei mai ti saresti messo<br />
                    sulla strada: che cos’altro ti aspetti?”
                </p> 
            </div>

        </div>
    );
};

export default Home;


