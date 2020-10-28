const axios = require('axios');
const cheerio = require('cherio');
const iconv = require('iconv-lite');
const fs = require('fs');

const parse = async() => {
    const getHTML = async(url) => {
        const { data } = await axios.get(url, { 
            headers: {
                Cookie: cookie
            },
            responseType: "arraybuffer" 
        });
        const ruHtml = iconv.decode(data, "win1251");
        return cheerio.load(ruHtml);
    }

    const $ = await getHTML('https://vk.com/stickers');
    
    const stickers = [];
    $('a.im_sticker_bl').each((i, elm) => {
        const href = $(elm).attr('href');
        const name = $(elm).find('div.im_sticker_bl_name').text();
        const price = $(elm).find('span.StickersBuyButton__currentPrice span.StickersButtonPrice__value').text();
        const img = $(elm).find('img.im_sticker_bl_demo_thumb').attr('src');

        stickers.push({ href, name, img, price: price.length == 0 ? `Бесплатно` : price });
    });

    return stickers;
};

setInterval(async() => {
    // Получение стикеров
    const stickers = await parse();

    // Запись в файл
    await fs.writeFileSync('stickers.json', JSON.stringify(stickers, null, 4));
}, 900000);