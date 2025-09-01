const visualizationContainer = document.querySelector('#visualization-container');

export function generateVisualization(array, container) {
    container.innerHTML = '';
    const barWidth = `calc(100% / ${array.length} - 2px)`;
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 2}px`;
        bar.style.inlineSize = barWidth;
        const barValue = document.createElement('span');
        barValue.classList.add('bar-value');
        barValue.textContent = value;
        bar.appendChild(barValue);
        container.appendChild(bar);
    });
}

function waitAndRender(delay, updateCallback) {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            updateCallback();
            setTimeout(resolve, delay);
        });
    });
}

export async function updateBars(delay, index1, index2, color) {
    const bars = visualizationContainer.querySelectorAll('.bar');
    const updateCallback = () => {
        bars.forEach(bar => {
            if (bar.style.backgroundColor !== 'var(--color-bar-sorted)') {
                bar.style.backgroundColor = 'var(--color-bar-default)';
            }
        });
        if (index1 !== undefined) setBarColor(index1, color);
        if (index2 !== undefined) setBarColor(index2, color);
    };
    return waitAndRender(101 - delay, updateCallback);
}

export function swapBars(index1, index2) {
    const bars = visualizationContainer.querySelectorAll('.bar');
    if (index1 < 0 || index1 >= bars.length || index2 < 0 || index2 >= bars.length) return;
    const bar1 = bars[index1];
    const bar2 = bars[index2];
    const tempHeight = bar1.style.height;
    const tempValue = bar1.querySelector('.bar-value').textContent;
    bar1.style.height = bar2.style.height;
    bar1.querySelector('.bar-value').textContent = bar2.querySelector('.bar-value').textContent;
    bar2.style.height = tempHeight;
    bar2.querySelector('.bar-value').textContent = tempValue;
}

export function setBarColor(index, color) {
    const bars = visualizationContainer.querySelectorAll('.bar');
    if (index >= 0 && index < bars.length) {
        bars[index].style.backgroundColor = color;
    }
}

export function setBarHeight(index, value) {
    const bars = visualizationContainer.querySelectorAll('.bar');
    if (index >= 0 && index < bars.length) {
        bars[index].style.height = `${value * 2}px`;
    }
}

export function setBarValue(index, value) {
    const bars = visualizationContainer.querySelectorAll('.bar');
    if (index >= 0 && index < bars.length) {
        bars[index].querySelector('.bar-value').textContent = value;
    }
}

export async function finalizeBars(speed) {
    const bars = visualizationContainer.querySelectorAll('.bar');
    for (const bar of bars) {
        setBarColor(Array.from(bars).indexOf(bar), 'var(--color-bar-sorted)');
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}