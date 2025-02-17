// import { Link } from '@inertiajs/react';
import React from 'react';
import brainIcon from '../../../public/icons/brain.png';
import headIcon from '../../../public/icons/head.png';


import { LogoItaca } from '../components/molecules/atoms/logoItaca';
import { LoginButton } from '../components/molecules/atoms/loginButton';
import { LoginInput } from '../components/molecules/atoms/loginInput';

const Home = () => {
    return (
        <div className=' bg-background h-screen w-screen flex flex-col '> 
           {/* <LogoItaca /> */}
           {/* <LoginButton/> */}
           <LoginInput inputType="text" iconLeft={headIcon}  />
           <LoginInput inputType="password" iconLeft={brainIcon}/>
        </div>
    );
};

export default Home;


