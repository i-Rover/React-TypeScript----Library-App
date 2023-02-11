import React from "react";

export const ExploreTopBooks = () => {
    return(
        <div className='p-5 mb-4 bg-dark header'>
            <div className='container-fluid py-5 text-white d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className="display fw-bold">
                        Find your next adventure
                    </h1>
                    <p className="col-md-8 fs-8">Where would like to go next?</p>
                    <a type="button" className="btn main-color btn-lg text-white" href="#">
                        Explore Top Books
                    </a>
                </div>
            </div>
        </div>
    );
}