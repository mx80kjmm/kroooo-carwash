
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
// @ts-ignore
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import * as googleTTS from 'google-tts-api';
import axios from 'axios';

// FFmpeg/FFprobe設定
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const OUTPUT_DIR = path.join(process.cwd(), 'output', 'video', 'db_audio_test');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const ASSETS_DIR = path.join(process.cwd(), 'scripts', 'video', 'assets');
const BGM_PATH = path.join(ASSETS_DIR, 'bgm_placeholder.mp3');

const WIDTH = 1080;
const HEIGHT = 1920;
const MIN_DURATION = 4.0; // 最小クリップ長(秒)

// Supabase設定
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- Helper Functions ---

async function downloadFile(url: string, outputPath: string) {
    const writer = fs.createWriteStream(outputPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise<void>((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

function getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration || 0);
        });
    });
}

async function generateTTS(text: string, outputPath: string) {
    console.log(`Generating Free TTS for: "${text.substring(0, 10)}..."`);
    try {
        const url = googleTTS.getAudioUrl(text, {
            lang: 'ja',
            slow: false,
            host: 'https://translate.google.com',
        });
        await downloadFile(url, outputPath);
    } catch (e) {
        console.error('TTS Error:', e);
        // Fallback to silent (1 sec)
        await new Promise<void>((resolve, reject) => {
            ffmpeg()
                .input('anullsrc')
                .inputFormat('lavfi')
                .duration(1)
                .outputOptions('-y')
                .save(outputPath)
                .on('end', () => resolve())
                .on('error', reject);
        });
    }
}

async function createTitleCard(text: string, subText: string, filename: string) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Gradient Background
    const grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grd.addColorStop(0, '#1e3a8a');
    grd.addColorStop(1, '#000000');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.font = 'bold 100px sans-serif';
    ctx.fillText(text, WIDTH / 2, HEIGHT / 2 - 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(subText, WIDTH / 2, HEIGHT / 2 + 50);

    fs.writeFileSync(filename, canvas.toBuffer('image/png'));
}

async function createLocationCard(location: any, index: number, filename: string) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 150px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`#${index + 1}`, WIDTH / 2, 400);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px sans-serif';
    ctx.fillText(location.name.substring(0, 15), WIDTH / 2, 600);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '40px sans-serif';
    ctx.fillText(location.address.substring(0, 20), WIDTH / 2, 700);

    fs.writeFileSync(filename, canvas.toBuffer('image/png'));
}

// ------------------------------------------------------------
// Main Process
// ------------------------------------------------------------

async function generateVideoWithAudio() {
    console.log('Fetching data...');
    const { data: locations } = await supabase
        .from('carwash_locations')
        .select('*')
        .ilike('address', '%大阪%')
        .limit(3);

    if (!locations || locations.length === 0) return console.error('No data found');

    const clips: string[] = [];
    const baseDir = OUTPUT_DIR;

    // --- 0. BGM Check/Generate ---
    if (!fs.existsSync(BGM_PATH)) {
        console.log('BGM not found, generating placeholder BGM...');
        await new Promise<void>((resolve, reject) => {
            ffmpeg()
                .input('sine=frequency=440:duration=10')
                .inputFormat('lavfi')
                .audioCodec('libmp3lame')
                .outputOptions('-y')
                .save(BGM_PATH)
                .on('end', () => resolve())
                .on('error', (err) => {
                    console.warn('Failed to generate BGM, proceeding without it.', err);
                    resolve();
                });
        });
    }

    // --- 1. Title Slide ---
    console.log('Processing Title...');
    const titleImg = path.join(baseDir, 'title.png');
    const titleAudio = path.join(baseDir, 'title.mp3');
    const titleClip = path.join(baseDir, 'clip_title.mp4');

    await createTitleCard('大阪のおすすめ', '洗車場 3選', titleImg);
    await generateTTS('大阪のおすすめ洗車場3選を紹介します。', titleAudio);

    await createClip(titleImg, titleAudio, titleClip);
    clips.push(titleClip);

    // --- 2. Location Slides ---
    for (let i = 0; i < locations.length; i++) {
        console.log(`Processing Loc ${i + 1}...`);
        const loc = locations[i];
        const locImg = path.join(baseDir, `loc_${i}.png`);
        const locAudio = path.join(baseDir, `loc_${i}.mp3`);
        const locClip = path.join(baseDir, `clip_loc_${i}.mp4`);

        await createLocationCard(loc, i, locImg);
        // 読み上げテキスト
        const speechText = `第${i + 1}位、${loc.name}。${loc.has_non_brush ? 'ノンブラシ洗車機があります。' : ''}`;
        await generateTTS(speechText, locAudio);

        await createClip(locImg, locAudio, locClip);
        clips.push(locClip);
    }

    // --- 3. Merge Clips ---
    console.log('Merging clips...');
    const mergedNoBgm = path.join(baseDir, 'merged_nobgm.mp4');
    await mergeClips(clips, mergedNoBgm);

    // --- 4. Add BGM ---
    console.log('Adding BGM...');
    const finalVideo = path.join(baseDir, 'final_with_audio_free.mp4');
    await addBGM(mergedNoBgm, BGM_PATH, finalVideo);

    console.log('Done! Video created at:', finalVideo);

    // Cleanup clips
    clips.forEach(p => { if (fs.existsSync(p)) fs.unlinkSync(p); });
    if (fs.existsSync(mergedNoBgm)) fs.unlinkSync(mergedNoBgm);
}

// ------------------------------------------------------------
// Helpers (Updated)
// ------------------------------------------------------------

async function createClip(imagePath: string, audioPath: string, outputPath: string) {
    // 1. 音声の長さを取得
    let duration = 0;
    try {
        duration = await getAudioDuration(audioPath);
    } catch (e) {
        console.warn(`Failed to get duration for ${audioPath}, assuming 1s`, e);
        duration = 1;
    }

    // 2. 最小時間を適用 (音声長 + 余韻0.5s と MIN_DURATION の長い方)
    const videoDuration = Math.max(duration + 0.5, MIN_DURATION);
    console.log(`Creating clip: Audio=${duration.toFixed(2)}s, Video=${videoDuration.toFixed(2)}s`);

    return new Promise<void>((resolve, reject) => {
        ffmpeg()
            .input(imagePath)
            .loop(1) // 画像ループ
            .input(audioPath)
            .videoFilters([
                `scale=${WIDTH}:${HEIGHT}`,
                'format=yuv420p'
            ])
            // -shortest を削除し、明示的に -t を指定
            .outputOptions(`-t ${videoDuration}`)
            //.outputOptions('-af aresample=async=1') // 音ズレ防止(option)
            .outputOptions('-y')
            .save(outputPath)
            .on('end', () => resolve())
            .on('error', reject);
    });
}

function mergeClips(clipPaths: string[], outputPath: string) {
    const listFile = path.join(OUTPUT_DIR, 'list.txt');
    const content = clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(listFile, content);

    return new Promise<void>((resolve, reject) => {
        ffmpeg()
            .input(listFile)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions('-c copy')
            .outputOptions('-y')
            .save(outputPath)
            .on('end', () => {
                if (fs.existsSync(listFile)) fs.unlinkSync(listFile);
                resolve();
            })
            .on('error', reject);
    });
}

function addBGM(videoPath: string, bgmPath: string, outputPath: string) {
    if (!fs.existsSync(bgmPath)) {
        fs.copyFileSync(videoPath, outputPath);
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .input(bgmPath)
            .inputOptions('-stream_loop -1')
            .complexFilter([
                '[1:a]volume=0.1[bgm]',
                '[0:a][bgm]amix=inputs=2:duration=first[outa]'
            ])
            .outputOptions([
                '-map 0:v',
                '-map [outa]',
                '-c:v copy'
            ])
            .outputOptions('-y')
            .save(outputPath)
            .on('end', () => resolve())
            .on('error', reject);
    });
}

generateVideoWithAudio().catch(console.error);
