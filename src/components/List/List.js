import React from 'react';

const displayItem = (i, item, baseUrl) => {
    if(typeof item === "object"){
        return <li key={i}><a href={baseUrl + item.id} target="_blank" className="compound">{ drawImage(item.id, item.title)} <span className="text"><span className="id">{item.id}</span><span>{item.title}</span></span></a></li>
    } else {
        return <li key={i}><a href={baseUrl + item} target="_blank">{item}</a></li>
    }
};

const drawImage = (configId, title) => {
    let imgUrl = 'https://images.toyota-europe.com/configuration/' + configId + '/exterior-04.png?width=100&height=59';
    return <img src={imgUrl} alt={title} />
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