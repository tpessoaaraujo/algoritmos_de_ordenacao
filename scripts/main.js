import {
    bubbleSort,
    insertionSort,
    mergeSort,
    quickSort,
    heapSort
} from './sort-algorithms.js';
import {
    generateVisualization,
    updateBars,
    swapBars,
    finalizeBars,
    setBarColor,
    setBarHeight,
    setBarValue
} from './visualizer.js';

const visualizationContainer = document.querySelector('#visualization-container');
const generateArrayBtn = document.querySelector('#generate-array-btn');
const startSortBtn = document.querySelector('#start-sort-btn');
const algorithmSelect = document.querySelector('#algorithm-select');
const arraySizeInput = document.querySelector('#array-size-input');
const arraySizeValue = document.querySelector('#array-size-value');
const speedInput = document.querySelector('#speed-input');
const speedValue = document.querySelector('#speed-value');
const algorithmNameEl = document.querySelector('#algorithm-name');
const algorithmDescriptionEl = document.querySelector('#algorithm-description');
const comparisonsCountEl = document.querySelector('#comparisons-count');
const swapsCountEl = document.querySelector('#swaps-count');
const timeElapsedEl = document.querySelector('#time-elapsed');

let array = [];
let arraySize = 30;
let sortSpeed = 50;
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;

const algorithms = {
    bubbleSort,
    insertionSort,
    mergeSort,
    quickSort,
    heapSort
};

function updateRangeA11y(inputElement, valueElement, ariaLabel) {
    const value = inputElement.value;
    valueElement.textContent = value;
    inputElement.setAttribute('aria-valuenow', value);
    inputElement.setAttribute('aria-valuetext', `${ariaLabel}: ${value}`);
}

function handleArraySizeChange() {
    arraySize = parseInt(arraySizeInput.value);
    updateRangeA11y(arraySizeInput, arraySizeValue, 'Tamanho do array');
    if (!isSorting) {
        generateNewArray();
    }
}

function handleSpeedChange() {
    sortSpeed = parseInt(speedInput.value);
    updateRangeA11y(speedInput, speedValue, 'Velocidade de ordenação');
}

function generateNewArray() {
    if (isSorting) {
        return;
    }
    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 200) + 1);
    generateVisualization(array, visualizationContainer);
}

async function startSorting() {
    if (isSorting) {
        return;
    }
    isSorting = true;
    startSortBtn.disabled = true;
    generateArrayBtn.disabled = true;
    algorithmSelect.disabled = true;

    comparisons = 0;
    swaps = 0;
    startTime = performance.now();
    comparisonsCountEl.textContent = comparisons;
    swapsCountEl.textContent = swaps;
    timeElapsedEl.textContent = '0.00';

    const selectedAlgorithm = algorithmSelect.value;
    const sortFunction = algorithms[selectedAlgorithm];

    if (sortFunction) {
        try {
            const visualizerCallbacks = {
                onCompare: (index1, index2) => {
                    comparisons++;
                    comparisonsCountEl.textContent = comparisons;
                    return updateBars(sortSpeed, index1, index2, 'var(--color-bar-comparison)');
                },
                onHighlight: (index) => setBarColor(index, 'var(--color-bar-highlight)'),
                onSwap: (index1, index2) => {
                    swaps++;
                    swapsCountEl.textContent = swaps;
                    return swapBars(index1, index2);
                },
                onSetColor: (index, color) => setBarColor(index, color),
                onSorted: (index) => setBarColor(index, 'var(--color-bar-sorted)'),
                onSetHeight: (index, value) => setBarHeight(index, value),
                onSetValue: (index, value) => setBarValue(index, value),
                getDelay: () => 101 - sortSpeed
            };

            const arrToUse = [...array];

            if (selectedAlgorithm === 'mergeSort' || selectedAlgorithm === 'quickSort') {
                await sortFunction(arrToUse, 0, arrToUse.length - 1, visualizerCallbacks);
            } else {
                await sortFunction(arrToUse, visualizerCallbacks);
            }
        } catch (error) {
            console.error('Ocorreu um erro durante a ordenação:', error);
        }
    }

    await finalizeBars(sortSpeed);

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);
    timeElapsedEl.textContent = timeTaken;

    isSorting = false;
    startSortBtn.disabled = false;
    generateArrayBtn.disabled = false;
    algorithmSelect.disabled = false;
}

function initialize() {
    arraySizeInput.addEventListener('input', handleArraySizeChange);
    speedInput.addEventListener('input', handleSpeedChange);
    generateArrayBtn.addEventListener('click', generateNewArray);
    startSortBtn.addEventListener('click', startSorting);
    generateNewArray();
}

document.addEventListener('DOMContentLoaded', initialize);