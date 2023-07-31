function getRandomElement(arr) {
    const randomIndex = getRandom(arr);
    return arr[randomIndex];
}

function getRandom(arr){
    return Math.floor(Math.random() * arr.length);

}



module.exports = {
    getRandomElement,
    getRandom
}