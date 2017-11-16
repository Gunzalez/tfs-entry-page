import React from 'react';

const displayItem = (item, baseUrl) => {
    return <li key={item.id}><a href={baseUrl + item.id} target="_blank" className="compound">{ drawImage(item.id, item.title)} <span className="text"><span className="id">{item.id}</span><span>{item.title}</span></span></a></li>
};

const drawImage = (configId, title) => {
    let imgUrl = 'https://images.toyota-europe.com/configuration/' + configId + '/exterior-04.png?width=100&height=59';
    return <img src={imgUrl} alt={title} />
};

const List = (props) => (
    <div className="list detailed">
        <h3>{ props.title }</h3>
        <p>Click any preconfigured Config IDs to start the TFS project</p>
        <p>Environment currently set to:<br /><strong>{ props.url }</strong></p>
        <ul>
            { props.items.map(item => {
                return displayItem(item, props.url)
            })}
        </ul>
    </div>
);

export default List;