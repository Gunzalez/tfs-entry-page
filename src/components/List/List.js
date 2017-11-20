import React from 'react';

const updateLocalHistoryList = configIdUrl => {
    if (typeof(Storage) !== "undefined") {

        let localConfigIds = [];
        if(localStorage.getItem("localConfigIds") !== null){
            localConfigIds = localStorage.getItem("localConfigIds").split('||');
        }

        if(localConfigIds.indexOf(configIdUrl) !== -1){
            let curIndex = localConfigIds.indexOf(configIdUrl);
            localConfigIds.splice(curIndex, 1);
        }
        localConfigIds.unshift(configIdUrl);

        // 10 should be from state in the main app, lazy
        if(localConfigIds.length > 10){
            let amountToRemove = localConfigIds.length - 10;
            localConfigIds.splice((10 - 1), amountToRemove);
        }

        localStorage.setItem("localConfigIds", localConfigIds.join('||'));
    }
};

const displayItem = (item, baseUrl) => {
    return (
        <div className="col-sm-4 single-config" key={item.id}>
            <a href={baseUrl + item.id} onClick={()=>{ updateLocalHistoryList(baseUrl + item.id)}} className="compound">
                { drawImage(item.id, item.title)}
                <span className="id">{item.id}</span>
                <span className="detail">{item.title}</span>
            </a>
        </div>
    )
};

const drawImage = (configId, title) => {
    let imgUrl = 'https://images.toyota-europe.com/configuration/' + configId + '/exterior-04.png?width=100&height=59';
    return <img src={imgUrl} alt={title} />
};

const List = (props) => (
    <div className="row list detailed">
        { props.items.map(item => {
            return displayItem(item, props.url)
        })}
    </div>
);

export default List;