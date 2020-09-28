export default function (increment, currentValue, values) {
    let currentIndex = 0;
    for (let index in values) {
        if (Object.prototype.hasOwnProperty.call(values, index) && values[index] === currentValue) {
            currentIndex = parseInt(index);
            break;
        }
    }

    let nextIndex = currentIndex + increment;
    if (nextIndex > values.length - 1) {
        nextIndex = 0;
    } else if (nextIndex < 0) {
        nextIndex = values.length - 1
    }

    return values[nextIndex];
}
