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
