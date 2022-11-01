function chunk(arr: [], size: number) {
    let result = [];
    for (let i = 0, len = arr.length; i < len; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export = chunk;
