import React from 'react';

const displayItem = (i, id, baseUrl) => {
    let url = baseUrl + id;
    return <li key={i}><a href={url} target="_blank">{id}</a></li>
};

const List = (props) => (
    <div className="list">
        <h3 className="heading">{ props.title }</h3>
        { props.sub ? <p>Links launch in a new window or tab</p> : null }
        <hr/>
        <ul>
            { props.items.map((item, i) => {
                return displayItem(i, item, props.url)
            })}
            { props.items.length < 1 ? <li>Empty list</li> : null }
        </ul>
    </div>
);

export default List;