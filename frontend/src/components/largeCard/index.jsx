import React from "react";

export default function LargeCard({contents}) {
    return <>
        <div className="container height-100 d-flex justify-content-center align-items-center mt-4 mb-4">
            <div className="card text-center">
                <div className="row py-4 px-5">
                    <div className="mx-auto">
                        {contents}
                    </div>
                </div>
            </div>
        </div>
    </>;
}