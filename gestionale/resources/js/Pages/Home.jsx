
// import React from 'react';

// import { LoginForm } from '../components/molecules/loginForm';

// const Home = () => {
//     return (
//         <div className=' bg-background h-screen w-screen flex flex-col items-center justify-center'> 
          
//            <LoginForm/>
//         </div>
//     );
// };

// export default Home;


import React from 'react';
import { LoginForm } from '../components/molecules/loginForm';
import { LogoItaca } from '../components/molecules/atoms/logoItaca';

const Home = () => {
    return (
        <div className="h-screen w-screen bg-background flex">
            
            {/* Sezione Sinistra */}
            <div className="flex w-[500px]  bg-transparent flex justify-center items-center">
               {/* Linee diagonali */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[-10%] left-[-335px] w-[140%] h-[3px] bg-[#484946] opacity-[80%] rotate-[-45deg] shadow-md"></div>
                    <div className="absolute top-[5%] left-[-550px] w-[150%] h-[3px] bg-bluPrimary opacity-[70%] rotate-[-45deg] shadow-md"></div>
                    <div className="absolute top-[10%] left-[-680px] w-[150%] h-[3px] bg-pinkPrimary opacity-[70%] rotate-[-45deg] shadow-md"></div>
                </div>

                <div className="absolute bottom-4 left-12">
                    <LogoItaca />
                </div>
            </div>

            {/* Sezione Destra */}
            <div className="flex-1 flex-col  bg-transparent flex justify-center items-end pr-12">
              
               <p className="text-gray-600 italic w-full  pl-4">
                    “Quando ti metterai in viaggio per Itaca<br />
                    devi augurarti che la strada sia lunga,<br />
                    fertile in avventure e in esperienze...”
                </p>

              
                <LoginForm />
                
                <p className="text-gray-600 italic w-full text-end mt-12 ">
                    “Itaca ti ha dato il bel viaggio,<br />
                    senza di lei mai ti saresti messo<br />
                    sulla strada: che cos’altro ti aspetti?”
                </p> 
            </div>

        </div>
    );
};

export default Home;
