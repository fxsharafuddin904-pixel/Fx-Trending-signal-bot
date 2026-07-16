const { getSignal } = require("./gemini");

const {
    getUser,
    updateUser
} = require("./database");

const {
    marketButtons,
    cancelButton,
    loadingButton,
    resultButtons,
    retryButton,
    noTradeButtons
} = require("./buttons");

/* =========================================
   OPEN MARKET MENU
========================================= */

async function openMarketMenu(ctx) {

    const message = `
📈 <b>Market নির্বাচন করুন</b>

━━━━━━━━━━━━━━━━━━

নিচের তালিকা থেকে আপনার Trading Pair নির্বাচন করুন।

এরপর Bot আপনাকে Chart Screenshot পাঠাতে বলবে।
`;

    try {

        return ctx.editMessageText(message, {

            parse_mode: "HTML",

            ...marketButtons()

        });

    } catch (err) {

        return ctx.reply(message, {

            parse_mode: "HTML",

            ...marketButtons()

        });

    }

}

/* =========================================
   SAVE MARKET
========================================= */

async function saveMarket(ctx) {

    const market = ctx.callbackQuery.data
        .replace("market_", "")
        .replace("EURUSD", "EUR/USD")
        .replace("USDJPY", "USD/JPY")
        .replace("GBPUSD", "GBP/USD")
        .replace("AUDUSD", "AUD/USD")
        .replace("USDCAD", "USD/CAD")
        .replace("USDCHF", "USD/CHF")
        .replace("NZDUSD", "NZD/USD")
        .replace("EURJPY", "EUR/JPY")
        .replace("EURGBP", "EUR/GBP")
        .replace("GBPJPY", "GBP/JPY");

    updateUser(ctx.from.id, {

        market,

        step: "waiting_screenshot"

    });

    return ctx.editMessageText(

`📸 <b>Screenshot পাঠান</b>

━━━━━━━━━━━━━━━━━━

✅ Market: <b>${market}</b>

এখন Trading Chart-এর একটি পরিষ্কার Screenshot পাঠান।

⚠️ শুধুমাত্র Chart-এর Screenshot পাঠাবেন।`,

        {

            parse_mode: "HTML",

            ...cancelButton()

        }

    );

}
/* =========================================
   HANDLE SCREENSHOT
========================================= */

async function handleScreenshot(ctx) {

    try {

        const user = getUser(ctx.from.id);

        if (user.step !== "waiting_screenshot") {

            return ctx.reply(
                "❌ আগে Market নির্বাচন করুন।",
                {
                    parse_mode: "HTML",
                    ...marketButtons()
                }
            );

        }

        const photo =
            ctx.message.photo[
                ctx.message.photo.length - 1
            ];

        if (!photo) {

            return ctx.reply(
                "❌ একটি Screenshot পাঠান।"
            );

        }

        // Telegram File Link
        const file = await ctx.telegram.getFile(
            photo.file_id
        );

        const fileUrl = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file.file_path}`;
        // Loading Message
        const loading = await ctx.reply(

`⏳ <b>চার্ট বিশ্লেষণ করা হচ্ছে...</b>

━━━━━━━━━━━━━━━━━━

🤖 Gemini AI আপনার চার্ট বিশ্লেষণ করছে।

অনুগ্রহ করে অপেক্ষা করুন...`,

            {
                parse_mode: "HTML",
                ...loadingButton()
            }

        );

        // Gemini Analysis
        const result = await getSignal(

            fileUrl,

            user.market,

            user.timeframe

        );

        // Save Result
        updateUser(ctx.from.id, {

            step: "idle",

            lastSignal: result

        });

        return {

            loadingId: loading.message_id,

            result,

            user

        };

    } catch (error) {

        console.log(error);

        updateUser(ctx.from.id, {

            step: "idle"

        });

        return ctx.reply(

`❌ <b>বিশ্লেষণ সম্পন্ন করা যায়নি।</b>

অনুগ্রহ করে আবার চেষ্টা করুন।`,

            {

                parse_mode: "HTML",

                ...retryButton()

            }

        );

    }

}
/* =========================================
   SHOW SIGNAL RESULT
========================================= */

async function showSignalResult(ctx, data) {

    const {
        loadingId,
        result,
        user
    } = data;

    let keyboard = resultButtons();

    if (result.signal === "NO TRADE") {
        keyboard = noTradeButtons();
    }

    const message = `
📊 <b>Premium Signal Report</b>

━━━━━━━━━━━━━━━━━━

📈 <b>Market</b>
${user.market}

⏱ <b>Timeframe</b>
${user.timeframe} Minute

━━━━━━━━━━━━━━━━━━

🎯 <b>Signal</b>
${result.signal}

📊 <b>Confidence</b>
${result.confidence}%

💰 <b>Entry</b>
${result.entry}

🎯 <b>Take Profit</b>
${result.take_profit}

🛑 <b>Stop Loss</b>
${result.stop_loss}

━━━━━━━━━━━━━━━━━━

📝 <b>Analysis</b>

${result.analysis}

━━━━━━━━━━━━━━━━━━

⚠️ <i>এটি AI Analysis।
নিজ দায়িত্বে Trade করুন।</i>
`;

    try {

        return await ctx.telegram.editMessageText(

            ctx.chat.id,

            loadingId,

            undefined,

            message,

            {

                parse_mode: "HTML",

                ...keyboard

            }

        );

    } catch (error) {

        return ctx.reply(message, {

            parse_mode: "HTML",

            ...keyboard

        });

    }

}

/* =========================================
   REGISTER SIGNAL
========================================= */

function registerSignal(bot) {

    // Open Market
    bot.action(
        "get_signal",
        openMarketMenu
    );

    // Select Market
    bot.action(
        /^market_/,
        saveMarket
    );

    // Receive Screenshot
    bot.on("photo", async (ctx) => {

        const data = await handleScreenshot(ctx);

        if (!data || !data.result) return;

        await showSignalResult(ctx, data);

    });

}

/* =========================================
   EXPORTS
========================================= */

module.exports = {

    openMarketMenu,

    saveMarket,

    handleScreenshot,

    showSignalResult,

    registerSignal

};
