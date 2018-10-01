exports.getValueByPath = (obj, path) => {
    return path.reduce((memo, part) => {
        if (!memo || !memo[part]) return null;

        return memo[part];
    }, obj);
};
