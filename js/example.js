let url = 'http://www.reddit.com/search.json?q=' + inputWord + '+nsfw:no';
    fetch(url)
        .then(function(responseData) {
            console.log('get data');
            return responseData.json();
        })
        .then(function(jsonData) {  
            inputWordUrlArray = jsonData.data.children.map(function(element) {
                return element.data.thumbnail;
            });
        });