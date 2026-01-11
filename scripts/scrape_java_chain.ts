
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://www.java-style.com';
const SHOP_LIST_URL = `${BASE_URL}/shop/`;

async function scrapeJavaChain() {
    console.log(`Starting scrape of ${SHOP_LIST_URL}...`);

    try {
        const { data: listHtml } = await axios.get(SHOP_LIST_URL);
        const $ = cheerio.load(listHtml);

        const shopLinks: string[] = [];
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.includes('/shop/') && !href.endsWith('/shop/') && !href.includes('#')) {
                const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
                if (!shopLinks.includes(fullUrl)) shopLinks.push(fullUrl);
            }
        });

        console.log(`Found ${shopLinks.length} shops.`);

        for (const url of shopLinks) {
            console.log(`Scraping ${url}...`);
            await scrapeShop(url);
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log('Scraping completed.');

    } catch (error: any) {
        console.error('Fatal error:', error.message);
    }
}

async function scrapeShop(url: string) {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // Name
        let name = $('.p-shop-detail__ttl').text().trim() || $('h1').text().trim() || $('h2:contains("洗車のジャバ")').text().trim();
        name = name.replace(/\s+/g, ' ').trim();
        if (name.includes('ガラスコーティング')) {
            const match = name.match(/洗車のジャバ\s+.*店/);
            if (match) name = match[0];
        } else if (name.includes('全国') && name.includes('洗車のジャバ')) {
            // Fallback cleanup
            const match = name.match(/洗車のジャバ\s+.*店/);
            if (match) name = match[0];
        }

        // Address
        let address = '';
        $('th').each((_, el) => {
            if ($(el).text().includes('住所')) address = $(el).next('td').text().trim();
        });
        address = address.split('\n')[0].trim();

        // Parse City/Prefecture
        let prefecture = '未分類';
        let city = '不明';
        const prefMatch = address.match(/(.+?[都道府県])/);
        if (prefMatch) prefecture = prefMatch[1];

        const cityMatch = address.match(/[都道府県](.+?[市区町村])/);
        if (cityMatch) city = cityMatch[1];
        else if (!prefMatch) {
            const fallbackMatch = address.match(/^(.+?[市区町村])/);
            if (fallbackMatch) city = fallbackMatch[1];
        }

        // Hours
        let hours = '';
        $('th').each((_, el) => {
            if ($(el).text().includes('営業時間')) hours = $(el).next('td').text().trim();
        });
        const is24h = /24時間|0:00～24:00|終日/.test(hours);

        // Subscription
        const bodyText = $('body').text();
        const hasSubscription = bodyText.includes('定額洗車') || bodyText.includes('サブスク');

        // Vehicle Size
        let maxVehicleSize = '';
        $('th').each((_, el) => {
            if ($(el).text().includes('車両サイズ')) maxVehicleSize = $(el).next('td').text().trim();
        });
        maxVehicleSize = maxVehicleSize.replace(/\s+/g, ' ');

        // Course Info
        let courseInfoLines: string[] = [];
        $('.p-shop-course__item').each((_, el) => {
            const title = $(el).find('.p-shop-course__item-ttl').text().trim();
            const price = $(el).find('.p-shop-course__item-price').text().trim();
            if (title && price) courseInfoLines.push(`${title}: ${price}`);
        });
        if (courseInfoLines.length === 0) {
            $('.box01').each((_, el) => {
                const text = $(el).find('.tit02').text().trim();
                if (text) courseInfoLines.push(text);
            });
        }
        const washCourseInfo = courseInfoLines.join(' / ');

        // Equipment
        const hasSuppliesVending = bodyText.includes('洗車用品自販機') || bodyText.includes('自販機');
        let hasStaff = true;
        $('th').each((_, el) => {
            if ($(el).text().includes('スタッフ')) {
                const val = $(el).next('td').text();
                if (val.includes('なし') || val.includes('不在')) hasStaff = false;
            }
        });

        console.log(`  -> ${name} | Size:${maxVehicleSize ? 'Y' : 'N'}`);

        // -- DB Sync --
        let targetId = null;

        // 1. Exact Name
        const { data: exactName } = await supabase
            .from('carwash_locations')
            .select('id')
            .eq('name', name)
            .maybeSingle();
        if (exactName) targetId = exactName.id;

        // 2. Fuzzy Address
        if (!targetId && address.length > 5) {
            const fuzzyAddr = address.replace(/^(大阪府|兵庫県|京都府|奈良県|滋賀県|和歌山県|東京都|神奈川県|千葉県|埼玉県)/, '');
            const { data: addrMatch } = await supabase
                .from('carwash_locations')
                .select('id')
                .like('address', `%${fuzzyAddr}%`)
                .maybeSingle();
            if (addrMatch) {
                console.log(`    Matched by Address: ${fuzzyAddr}`);
                targetId = addrMatch.id;
            }
        }

        const payload = {
            name, address, is_24h: is24h, has_staff: hasStaff,
            has_subscription: hasSubscription,
            has_supplies_vending: hasSuppliesVending,
            wash_course_info: washCourseInfo.substring(0, 1000),
            max_vehicle_size: maxVehicleSize,
            business_hours: hours,
            has_manual_spray_wash: true, has_gantry_wash: true, has_non_brush: true
        };

        if (targetId) {
            const { error } = await supabase.from('carwash_locations').update(payload).eq('id', targetId);
            if (error) console.error(`    Update Error: ${error.message}`);
            else console.log(`    Updated: ${targetId}`);
        } else {
            // New Store
            console.log(`    Planting new store: ${name}`);
            const { error } = await supabase.from('carwash_locations').insert([{
                ...payload,
                latitude: 0, longitude: 0,
                prefecture, city
            }]);
            if (error) console.error(`    Insert Error: ${error.message}`);
            else console.log(`    Inserted new record.`);
        }

    } catch (e: any) {
        console.error(`  Error scraping ${url}:`, e.message);
    }
}

scrapeJavaChain();
