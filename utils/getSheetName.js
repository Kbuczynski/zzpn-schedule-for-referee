module.exports = (link) => {
    const linkArr = link.split('/');
    const nameArr = linkArr[linkArr.length - 2].split('-');
    const name = nameArr.slice(2, 6).join('.');
    return name.substring(0, name.length / 2) + ' - ' + name.substring(name.length / 2 + 1);
}