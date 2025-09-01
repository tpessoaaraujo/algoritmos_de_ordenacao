function wait(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export async function bubbleSort(arr, callbacks) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await callbacks.onCompare(j, j + 1);
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                callbacks.onSwap(j, j + 1);
            }
            await wait(callbacks.getDelay());
        }
        callbacks.onSorted(n - 1 - i);
    }
    callbacks.onSorted(0);
}

export async function insertionSort(arr, callbacks) {
    const n = arr.length;
    callbacks.onSorted(0);
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        await callbacks.onHighlight(i);
        await wait(callbacks.getDelay());
        while (j >= 0 && arr[j] > key) {
            await callbacks.onCompare(j, j + 1);
            arr[j + 1] = arr[j];
            callbacks.onSwap(j + 1, j);
            j--;
        }
        arr[j + 1] = key;
        callbacks.onSetColor(j + 1, 'var(--color-bar-sorted)');
    }
}

export async function mergeSort(arr, start, end, callbacks) {
    if (start >= end) {
        return;
    }
    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, start, mid, callbacks);
    await mergeSort(arr, mid + 1, end, callbacks);
    await merge(arr, start, mid, end, callbacks);
}

async function merge(arr, start, mid, end, callbacks) {
    let i = start;
    let j = mid + 1;
    let temp = [];
    for (let k = start; k <= end; k++) {
        callbacks.onSetColor(k, 'var(--color-bar-comparison)');
    }
    await wait(callbacks.getDelay());
    while (i <= mid && j <= end) {
        callbacks.onCompare(i, j);
        await wait(callbacks.getDelay());
        if (arr[i] <= arr[j]) {
            temp.push(arr[i++]);
        } else {
            temp.push(arr[j++]);
        }
    }
    while (i <= mid) {
        temp.push(arr[i++]);
    }
    while (j <= end) {
        temp.push(arr[j++]);
    }
    for (let k = start; k <= end; k++) {
        arr[k] = temp[k - start];
        callbacks.onSetHeight(k, arr[k]);
        callbacks.onSetValue(k, arr[k]);
        await wait(callbacks.getDelay());
        callbacks.onSetColor(k, 'var(--color-bar-sorted)');
    }
}

export async function quickSort(arr, start, end, callbacks) {
    if (start >= end) {
        if (start === end) {
            callbacks.onSorted(start);
        }
        return;
    }
    const pivotIndex = await partition(arr, start, end, callbacks);
    await quickSort(arr, start, pivotIndex - 1, callbacks);
    await quickSort(arr, pivotIndex + 1, end, callbacks);
}

async function partition(arr, start, end, callbacks) {
    const pivot = arr[end];
    let i = start - 1;
    callbacks.onSetColor(end, 'var(--color-bar-highlight)');
    await wait(callbacks.getDelay());
    for (let j = start; j < end; j++) {
        callbacks.onCompare(j, end);
        await wait(callbacks.getDelay());
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            callbacks.onSwap(i, j);
            await wait(callbacks.getDelay());
            callbacks.onSetColor(i, 'var(--color-bar-sorted)');
        } else {
            callbacks.onSetColor(j, 'var(--color-bar-default)');
        }
    }
    [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
    callbacks.onSwap(i + 1, end);
    await wait(callbacks.getDelay());
    callbacks.onSorted(i + 1);
    return i + 1;
}

export async function heapSort(arr, callbacks) {
    let n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i, callbacks);
    }
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        callbacks.onSwap(0, i);
        await wait(callbacks.getDelay());
        callbacks.onSorted(i);
        await heapify(arr, i, 0, callbacks);
    }
    callbacks.onSorted(0);
}

async function heapify(arr, n, i, callbacks) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    callbacks.onHighlight(i);
    if (left < n) callbacks.onSetColor(left, 'var(--color-bar-comparison)');
    if (right < n) callbacks.onSetColor(right, 'var(--color-bar-comparison)');
    await wait(callbacks.getDelay());
    if (left < n && arr[left] > arr[largest]) {
        callbacks.onCompare(left, largest);
        largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
        callbacks.onCompare(right, largest);
        largest = right;
    }
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        callbacks.onSwap(i, largest);
        await wait(callbacks.getDelay());
        await heapify(arr, n, largest, callbacks);
    }
    callbacks.onSetColor(i, 'var(--color-bar-default)');
    if (left < n) callbacks.onSetColor(left, 'var(--color-bar-default)');
    if (right < n) callbacks.onSetColor(right, 'var(--color-bar-default)');
}