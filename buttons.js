const { Markup } = require("telegraf");
const config = require("./config");

/* ===============================
   START MENU
================================ */

function startButtons() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                "📈 Get Signal",
                "get_signal"
            )
        ],

        [
            Markup.button.callback(
                "⚙️ Settings",
                "settings"
            )
        ]

    ]);

}

/* ===============================
   SETTINGS MENU
================================ */

function settingsButtons() {

    const buttons = [];

    config.TIMEFRAMES.forEach((time) => {

        buttons.push([

            Markup.button.callback(
                `⏱ ${time} Minute`,
                `tf_${time}`
            )

        ]);

    });

    buttons.push([

        Markup.button.callback(
            "🏠 Home",
            "home"
        )

    ]);

    return Markup.inlineKeyboard(buttons);

}

/* ===============================
   EXPORT (Temporary)
================================ */

module.exports = {

    startButtons,
    settingsButtons

};
/* ===============================
   MARKET BUTTONS
================================ */

function marketButtons() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback("🇪🇺 EUR/USD", "market_EURUSD"),
            Markup.button.callback("🇺🇸 USD/JPY", "market_USDJPY")
        ],

        [
            Markup.button.callback("🇬🇧 GBP/USD", "market_GBPUSD"),
            Markup.button.callback("🇦🇺 AUD/USD", "market_AUDUSD")
        ],

        [
            Markup.button.callback("🇺🇸 USD/CAD", "market_USDCAD"),
            Markup.button.callback("🇺🇸 USD/CHF", "market_USDCHF")
        ],

        [
            Markup.button.callback("🇳🇿 NZD/USD", "market_NZDUSD"),
            Markup.button.callback("🇪🇺 EUR/JPY", "market_EURJPY")
        ],

        [
            Markup.button.callback("🇪🇺 EUR/GBP", "market_EURGBP"),
            Markup.button.callback("🇬🇧 GBP/JPY", "market_GBPJPY")
        ],

        [
            Markup.button.callback("🔙 Back", "home")
        ]

    ]);

}

/* ===============================
   RESULT BUTTONS
================================ */

function resultButtons() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                "📈 New Signal",
                "get_signal"
            )
        ],

        [
            Markup.button.callback(
                "⚙️ Settings",
                "settings"
            )
        ],

        [
            Markup.button.callback(
                "🏠 Home",
                "home"
            )
        ]

    ]);

}

/* ===============================
   CANCEL BUTTON
================================ */

function cancelButton() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                "❌ Cancel",
                "cancel"
            )
        ]

    ]);

}

/* ===============================
   ERROR BUTTON
================================ */

function retryButton() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                "🔄 Try Again",
                "get_signal"
            )
        ],

        [
            Markup.button.callback(
                "🏠 Home",
                "home"
            )
        ]

    ]);

            }
/* ===============================
   LOADING BUTTONS
================================ */

function loadingButton() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                "⏳ বিশ্লেষণ চলছে...",
                "loading"
            )
        ]

    ]);

}

/* ===============================
   NO TRADE BUTTONS
================================ */

function noTradeButtons() {

    return Markup.inlineKeyboard([

        [
            Markup.button.callback(
                "🔄 আবার বিশ্লেষণ করুন",
                "get_signal"
            )
        ],

        [
            Markup.button.callback(
                "⚙️ Settings",
                "settings"
            )
        ],

        [
            Markup.button.callback(
                "🏠 Home",
                "home"
            )
        ]

    ]);

}

/* ===============================
   EXPORTS
================================ */

module.exports = {

    // Home
    startButtons,

    // Settings
    settingsButtons,

    // Market
    marketButtons,

    // Result
    resultButtons,

    // Cancel
    cancelButton,

    // Retry
    retryButton,

    // Loading
    loadingButton,

    // No Trade
    noTradeButtons

};
