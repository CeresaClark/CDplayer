const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 9000;
canvas.height = 255;

let audioSource, analyser;


$("#uploadMusic").change(function () {
    $('#progress_bar').css('left', '-100%')
    $('#progress_dot').css('left', '0%')
    const files = this.files;
    const audio = document.getElementById('audio');
    const audioContext = new AudioContext();
    audio.src = URL.createObjectURL(files[0]);
    audio.load();

    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount; //fftSize的一半
    const dataArray = new Uint8Array((bufferLength));

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);

        requestAnimationFrame(animate);
    }

    animate();


    $('#playBtn').on('click', function () {
        audio.play()
        $('.CDrotate').css('animation-play-state', 'running')
    })

    $('#pauseBtn').on('click', function () {
        audio.pause()
        $('.CDrotate').css('animation-play-state', 'paused')
    })

    //每秒偵測進度條位置
    setInterval(() => {
        $('#progress_bar').css('left', -100 + (audio.currentTime / audio.duration * 100) + '%')
        $('#progress_dot').css('left', (audio.currentTime / audio.duration * 100) + '%')
    }, 100);

});

let color = '#000'

//畫圖用
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        if (barHeight >= 0 && barHeight < 25.5) {
            barHeight = 25.5
        } else if (barHeight >= 25.5 && barHeight < 51) {
            barHeight = 51
        } else if (barHeight >= 51 && barHeight < 76.5) {
            barHeight = 76.5
        } else if (barHeight >= 76.5 && barHeight < 102) {
            barHeight = 102
        } else if (barHeight >= 102 && barHeight < 127.5) {
            barHeight = 127.5
        } else if (barHeight >= 127.5 && barHeight < 153) {
            barHeight = 153
        } else if (barHeight >= 153 && barHeight < 178.5) {
            barHeight = 178.5
        } else if (barHeight >= 178.5 && barHeight < 204) {
            barHeight = 204
        } else if (barHeight >= 204 && barHeight < 229.5) {
            barHeight = 229.5
        } else if (barHeight >= 229.5 && barHeight <= 255) {
            barHeight = 255
        }

        var grd = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        grd.addColorStop(0, "#cfcfcf00");
        grd.addColorStop(1, color);

        ctx.fillStyle = grd;
        ctx.fillRect(canvas.width - x, canvas.height - barHeight, barWidth, barHeight);

        x = x + barWidth + 15;

    }

}







//上傳CD
$("#uploadImg").change(function () {
    uploadCDImg(this);
});

//上傳Logo
$("#uploadLogo").change(function () {
    uploadlogoImg(this);
});

//輸入代表色
$("#uploadColor").change(function () {
    uploadColor($("#uploadColor").val());
});


function uploadlogoImg(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#logoImg").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function uploadCDImg(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#CDImg").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function uploadColor(input) {
    $('#musicName').css('color', input)
    $('.gradient,#progress_dot,#progress_bar').css('background-color', input)
    color = input
}
