
import dotenv from 'dotenv';
// .env.local を読み込む (Supabase接続用)
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

// FFmpeg設定
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const OUTPUT_DIR = path.join(process.cwd(), 'output', 'video', 'db_test');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const WIDTH = 1080;
const HEIGHT = 1920;

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase ENV variables missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- 画像生成関数 ---

// タイトルカード
async function createTitleCard(text: string, subText: string, filename: string) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // 背景 (グラデーション)
    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grd.addColorStop(0, '#1e3a8a'); // Blue-900
    grd.addColorStop(1, '#000000');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // テキスト
    ctx.fillStyle = '#fbbf24'; // Amber-400
    ctx.textAlign = 'center';

    ctx.font = 'bold 100px sans-serif';
    ctx.fillText(text, WIDTH / 2, HEIGHT / 2 - 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(subText, WIDTH / 2, HEIGHT / 2 + 50);

    fs.writeFileSync(filename, canvas.toBuffer('image/png'));
}

// 店舗情報カード
async function createLocationCard(location: any, index: number, filename: string) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // 背景
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 順位/番号
    ctx.fillStyle = '#ef4444'; // Red-500
    ctx.font = 'bold 150px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`#${index + 1}`, WIDTH / 2, 400);

    // 店舗名
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px sans-serif';

    // 簡易的な中央揃え & 折り返しなし (長すぎると切れるので注意)
    ctx.fillText(location.name.substring(0, 15), WIDTH / 2, 600);

    // 住所
    ctx.fillStyle = '#9ca3af'; // Gray-400
    ctx.font = '40px sans-serif';
    ctx.fillText(location.address.substring(0, 20), WIDTH / 2, 700);

    // 設備情報 (アイコン的表示)
    let y = 900;
    ctx.textAlign = 'left';
    ctx.font = '50px sans-serif';
    const x = 200;

    const items = [
        { label: '✨ ノンブラシ', val: location.has_non_brush },
        { label: '🚿 セルフ洗車', val: location.has_self_wash },
        { label: '🤖 自動洗車機', val: location.has_auto_wash },
        { label: '🧹 掃除機', val: location.has_vacuum },
    ];

    items.forEach(item => {
        ctx.fillStyle = item.val ? '#4ade80' : '#4b5563'; // Green or Gray
        ctx.fillText(`${item.val ? '✅' : '❌'} ${item.label}`, x, y);
        y += 100;
    });

    fs.writeFileSync(filename, canvas.toBuffer('image/png'));
}

// --- メイン処理 ---

async function generateVideoFromDB() {
    console.log('Fetching data from Supabase...');

    // 例: 大阪府のデータをランダムに3件
    const { data: locations, error } = await supabase
        .from('carwash_locations')
        .select('*')
        .ilike('address', '%大阪%')
        .limit(3);

    if (error || !locations || locations.length === 0) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log(`Found ${locations.length} locations.`);

    // 1. 画像生成
    const baseDir = OUTPUT_DIR;
    const titlePath = path.join(baseDir, '0_title.png');
    await createTitleCard('大阪のおすすめ', '洗車場 3選', titlePath);

    const imagePaths = [titlePath];

    for (let i = 0; i < locations.length; i++) {
        const locPath = path.join(baseDir, `${i + 1}_loc.png`);
        await createLocationCard(locations[i], i, locPath);
        imagePaths.push(locPath);
    }

    // 2. 動画結合 (FFmpeg)
    // 確実な方法: 一旦それぞれの画像を短い動画クリップ(mp4)に変換する
    console.log('Generating video clips...');
    const clipPaths: string[] = [];

    for (let i = 0; i < imagePaths.length; i++) {
        const clipPath = path.join(baseDir, `clip_${i}.mp4`);
        await new Promise<void>((resolve, reject) => {
            ffmpeg(imagePaths[i])
                .loop(3) // 3秒ループ
                .fps(30)
                .inputOptions('-t 3') // 入力側で時間制限 (重要)
                .videoFilters([
                    `scale=${WIDTH}:${HEIGHT}`,
                    'format=yuv420p' // ピクセルフォーマット指定
                ])
                .save(clipPath)
                .on('end', () => resolve())
                .on('error', (err) => reject(err));
        });
        clipPaths.push(clipPath);
        console.log(`Generated clip: ${clipPath}`);
    }

    console.log('Merging clips into final movie (Manual Concat)...');

    // 生成したクリップを結合
    const outputVideo = path.join(baseDir, 'final_movie.mp4');
    const listFile = path.join(baseDir, 'list.txt');

    // Windows環境でのFFmpeg互搬性のため、絶対パス＋スラッシュ区切りにする
    const listContent = clipPaths.map(p => {
        // バックスラッシュをスラッシュに置換
        const normalizedPath = p.replace(/\\/g, '/');
        return `file '${normalizedPath}'`;
    }).join('\n');

    fs.writeFileSync(listFile, listContent);

    try {
        await new Promise<void>((resolve, reject) => {
            ffmpeg()
                .input(listFile)
                .inputOptions(['-f concat', '-safe 0'])
                .outputOptions('-c copy')
                .save(outputVideo)
                .on('end', () => {
                    console.log('Video generated successfully:', outputVideo);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error merging videos:', err);
                    reject(err);
                });
        });
    } catch (e) {
        console.error('Merge failed:', e);
    } finally {
        // クリップ削除 (Cleanup) - 成功失敗に関わらず実行
        if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
        clipPaths.forEach(p => {
            if (fs.existsSync(p)) fs.unlinkSync(p);
        });
    }
}

generateVideoFromDB().catch(console.error);
