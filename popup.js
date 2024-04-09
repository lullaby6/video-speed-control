let speed = 1
let changeSpeed = 0.125
let extraChangeSpeed = 1
let minSpeed = changeSpeed
let maxSpeed = 10

async function videoSpeedControl(speed) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [speed],
        func: (speed) => {
            document.querySelectorAll('video').forEach(video => {
                video.playbackRate = speed
            })
        },
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    const prevButton = document.querySelector('#prev')
    const extraPrevButton = document.querySelector('#extra-prev')
    const nextButton = document.querySelector('#next')
    const extraNextButton = document.querySelector('#extra-next')
    const input = document.querySelector('input')

    prevButton.addEventListener('click', async () => {
        if (input.value > minSpeed) {
            input.value = parseFloat(input.value) - changeSpeed
            await videoSpeedControl(input.value)
        }
    })

    extraPrevButton.addEventListener('click', async () => {
        if (parseFloat(input.value) - extraChangeSpeed >= minSpeed) {
            input.value = parseFloat(input.value) - extraChangeSpeed
            await videoSpeedControl(input.value)
        }
    })

    nextButton.addEventListener('click', async () => {
        if (input.value < maxSpeed) {
            input.value = parseFloat(input.value) + changeSpeed
            await videoSpeedControl(input.value)
        }
    })

    extraNextButton.addEventListener('click', async () => {
        if (parseFloat(input.value) + extraChangeSpeed <= maxSpeed) {
            input.value = parseFloat(input.value) + extraChangeSpeed
            await videoSpeedControl(input.value)
        }
    })

    input.addEventListener('change', async () => {
        if (input.value < minSpeed) {
            input.value = minSpeed
        } else if (input.value > maxSpeed) {
            input.value = maxSpeed
        }
        await videoSpeedControl(input.value)
    })

    input.addEventListener('input', async () => {
        if (input.value != '' && input.value) {
            if (input.value < minSpeed) {
                input.value = minSpeed
            } else if (input.value > maxSpeed) {
                input.value = maxSpeed
            }
            await videoSpeedControl(input.value)
        }
    })
});