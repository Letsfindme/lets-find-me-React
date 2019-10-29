import React, {Fragment, useEffect, useState} from "react";
import StoreItem from "../../components/Store/StoreItem/StoreItem";

export default props => {
    useEffect(() => {
            console.log()
        }
        , []);
    return (
        <div className={'wrapper-store'}>
            <h1>sotre</h1>
            <StoreItem></StoreItem>
        </div>
    )
}