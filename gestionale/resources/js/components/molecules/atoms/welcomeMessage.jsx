import React from "react";


export const WelcomeMessage =({username}) =>{
const usernameCapitals= username.toUpperCase();
return (
    <div >
        <span  className="block font-marcellusSC text-black text-[14px] drop-shadow-2xl">CIAO, {usernameCapitals}!</span>
    </div>
);

}