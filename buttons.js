const { Markup } = require("telegraf");
const config = require("./config");


// Start Menu

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



// Settings

function settingsButtons() {

    const buttons = [];

    for (const tf of config.TIMEFRAMES) {

        buttons.push([

            Markup.button.callback(
                `⏱ ${tf} Minute`,
                `tf_${tf}`
            )

        ]);

    }

    buttons.push([

        Markup.button.callback(
            "⬅️ Back",
            "back_home"
        )

    ]);

    return Markup.inlineKeyboard(buttons);

}



// Market

function marketButtons() {

    const rows = [];

    for (let i = 0; i < config.MARKETS.length; i += 2) {

        rows.push([

            Markup.button.callback(
                config.MARKETS[i],
                `market_${i}`
            ),

            Markup.button.callback(
                config.MARKETS[i + 1],
                `market_${i + 1}`
            )

        ]);

    }

    rows.push([

        Markup.button.callback(
            "⬅️ Back",
            "back_home"
        )

    ]);

    return Markup.inlineKeyboard(rows);

}

module.exports = {

    startButtons,
    settingsButtons,
    marketButtons

};
