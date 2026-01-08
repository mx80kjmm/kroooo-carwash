
import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

// FFmpegのパスを設定
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const OUTPUT_DIR = path.join(process.cwd(), 'output', 'video');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ターゲット: 9:16 (TikToK/Shorts)
const WIDTH = 1080;
const HEIGHT = 1920;

async function createTitleCard(text: string, filename: string) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // 背景
    ctx.fillStyle = '#111827'; // Dark gray
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // テキスト設定
    ctx.fillStyle = '#fbbf24'; // Amber-400
    ctx.font = 'bold 80px sans-serif'; // フォント要調整
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 簡易的なテキスト折り返し
    const words = text.split(' ');
    let line = '';
    let y = HEIGHT / 2;

    // (簡易実装: 1行で描画)
    ctx.fillText(text, WIDTH / 2, y);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
}

async function generateVideo() {
    console.log('Generating assets...');
    const frame1 = path.join(OUTPUT_DIR, 'frame1.png');
    const outputVideo = path.join(OUTPUT_DIR, 'tiktok_draft.mp4');

    await createTitleCard('大阪の洗車場 3選', frame1);

    console.log('Rendering video...');

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(frame1)
            .loop(3) // 3秒静止画
            .fps(30)
            .videoFilters([
                {
                    filter: 'scale',
                    options: `${WIDTH}:${HEIGHT}`
                }
            ])
            .save(outputVideo)
            .on('end', () => {
                console.log('Video generated successfully:', outputVideo);
                resolve(outputVideo);
            })
            .on('error', (err) => {
                console.error('Error generating video:', err);
                reject(err);
            });
    });
}

// 実行
generateVideo().catch(err => console.error(err));
