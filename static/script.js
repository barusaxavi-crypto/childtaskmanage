function drawClock() {
    const canvas = document.getElementById("analogClock");
    const ctx = canvas.getContext("2d");
    let radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90;

    // 初回描画
    drawClockHands(ctx, radius);

    // 1秒ごとに時計を再描画
    setInterval(() => drawClockHands(ctx, radius), 1000);
}

function drawClockHands(ctx, radius) {
    ctx.clearRect(-radius * 1.5, -radius * 1.5, radius * 3, radius * 3);

    // 時計の文字盤を描画
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();

    // 中心のポッチを描画
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    // 時計の数字を描画
    ctx.font = "bold " + radius * 0.3 + "px 'M PLUS Rounded 1c', Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let num = 1; num <= 12; num++) {
        let ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.75);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.75);
        ctx.rotate(-ang);
    }

    // 現在時刻の取得
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    // デジタル時計の更新
    document.getElementById("digitalClock").innerText =
        hour.toString().padStart(2, '0') + ":" +
        minute.toString().padStart(2, '0');

    // 時針の描画
    hour = hour % 12;
    hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.08);

    // 分針の描画
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.7, radius * 0.06);

    // 秒針の描画
    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.8, radius * 0.02, '#ff3b30');
}

function drawHand(ctx, pos, length, width, color = '#333') {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

document.addEventListener("DOMContentLoaded", () => {
    drawClock();
});

function toggleTask(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    if (checkbox.checked) {
        taskItem.classList.add('completed');
    } else {
        taskItem.classList.remove('completed');
    }

    // 現在の子供(kid-section)の全タスクが完了したか確認
    const kidSection = checkbox.closest('.kid-section');
    const kidId = kidSection.id.replace('section-', '');
    const allCheckboxes = kidSection.querySelectorAll('.task-checkbox');
    let allDone = true;

    // タスクがない場合は allDone=false とする
    if (allCheckboxes.length === 0) allDone = false;

    allCheckboxes.forEach(cb => {
        if (!cb.checked) allDone = false;
    });

    const btnDone = document.getElementById('btn-done-' + kidId);
    if (btnDone) {
        if (allDone) {
            btnDone.style.display = 'inline-block';
        } else {
            btnDone.style.display = 'none';
        }
    }
}

// 効果音を鳴らす関数 (Web Audio API)
function playHappySound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // 1つ目の音
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc1.start(audioCtx.currentTime);
        osc1.stop(audioCtx.currentTime + 0.3);

        // 2つ目の音
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc2.start(audioCtx.currentTime + 0.1);
        osc2.stop(audioCtx.currentTime + 0.4);

        // 3つ目の音
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.connect(gain3);
        gain3.connect(audioCtx.destination);
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain3.gain.setValueAtTime(0.1, audioCtx.currentTime + 0.2);
        gain3.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc3.start(audioCtx.currentTime + 0.2);
        osc3.stop(audioCtx.currentTime + 0.6);

        // 4つ目の音
        const osc4 = audioCtx.createOscillator();
        const gain4 = audioCtx.createGain();
        osc4.connect(gain4);
        gain4.connect(audioCtx.destination);
        osc4.type = 'triangle';
        osc4.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
        gain4.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.3);
        gain4.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
        osc4.start(audioCtx.currentTime + 0.3);
        osc4.stop(audioCtx.currentTime + 1.0);

    } catch (e) {
        console.error('Audio playback failed', e);
    }
}

// 「できた」ボタンの処理
function markDone(kidId, timeOfDay) {
    const btnDone = document.getElementById('btn-done-' + kidId);
    if (!btnDone || btnDone.disabled) return;

    // ボタンを無効化して連打防止
    btnDone.disabled = true;
    btnDone.innerText = '🌟 すばらしい！';

    // 効果音再生
    playHappySound();

    // サーバーへ完了を送信
    fetch('/api/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kid_id: kidId,
            time_of_day: timeOfDay
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') {
                console.error('Save failed:', data.message);
                alert('ほぞんにしっぱいしました。');
                btnDone.disabled = false;
                btnDone.innerText = '🎉 できた！';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            btnDone.disabled = false;
            btnDone.innerText = '🎉 できた！';
        });
}
