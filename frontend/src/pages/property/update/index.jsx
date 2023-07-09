import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts";
import LargeCard from "../../../components/largeCard";
import BackButton from "../../../components/backbutton";


export default function EditProperty(props) {
    const { token } = useContext(UserContext);


    const contents = () => {
        return <>
            <p>Incomplete </p>

        </>;
    }

    return <>
        <BackButton />
        <LargeCard contents={contents()} />
    </>;
}