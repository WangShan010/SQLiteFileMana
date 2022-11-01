const awaitWrap = (promise: Promise<any>) => {
    return promise
        .then(data => [null, data])
        .catch(err => [err, null]);
};

export = awaitWrap;
