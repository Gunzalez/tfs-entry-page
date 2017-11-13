import React from 'react';

let listOfItems = [];

const getList = () => {

    let url = '/data/configids.json';
    fetch(url)
        .then(response => {
            return response.json()
        })
        .then(array => {
            listOfItems = array;
        })
        .catch(function(err){
            console.log(err);
        });
    return listOfItems;
};

const listItem = (id, baseUrl) => {
    let url = baseUrl + id;
    return <li key={id}><a href={url} target="_blank">{id}</a></li>
};

const List = (props) => (
    <div className="form">
        <div className="container">
            <h3 className="heading">List of Config IDs</h3>
            <p className="helper">Click on a config ID from the list</p>
            <p className='helper'>This will launch the demo site in a new window/tab</p>
            <hr/>
            <ul className="list">
                { getList().map(item => { return listItem(item, props.url) }) }
            </ul>
        </div>
    </div>
);

export default List;