import React from 'react'
import PacmanLoader from "react-spinners/PacmanLoader";

function Loader({message}) {
    return (
        <div className="blurred-background">
            <div className="overlay"></div>
            <div className="spanner">
                <div className="loader">
                    <PacmanLoader color="#ffe737" />
                </div>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Loader
