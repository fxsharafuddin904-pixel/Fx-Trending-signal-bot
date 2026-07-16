const {
    settingsButtons,
    startButtons
} = require("./buttons");

const {
    getUser,
    updateUser
} = require("./database");

/* =========================================
   OPEN SETTINGS MENU
========================================= */

async function openSettings(ctx) {

    const user = getUser(ctx.from.id);

    const message = `
⚙️ <b>Bot Settings</b>

━━━━━━━━━━━━━━━━━━

⏱ <b>Current Timeframe</b>

${user.timeframe} Minute

━━━━━━━━━━━━━━━━━━

📌 আপনার ট্রেডিংয়ের জন্য একটি Timeframe নির্বাচন করুন।

নির্বাচিত Timeframe ভবিষ্যতের সকল Signal-এর জন্য ব্যবহার করা হবে।
`;

    if (ctx.callbackQuery) {

        return ctx.editMessageText(message, {
            parse_mode: "HTML",
            ...settingsButtons()
        });

    }

    return ctx.reply(message, {
        parse_mode: "HTML",
        ...settingsButtons()
    });

}
/* =========================================
   SAVE TIMEFRAME
========================================= */

async function saveTimeframe(ctx) {

    try {

        const timeframe = Number(
            ctx.callbackQuery.data.split("_")[1]
        );

        updateUser(ctx.from.id, {

            timeframe: timeframe

        });

        await ctx.answerCbQuery(
            `✅ ${timeframe} Minute নির্বাচন করা হয়েছে`
        );

        const message = `
✅ <b>Settings Updated</b>

━━━━━━━━━━━━━━━━━━

⏱ <b>Current Timeframe</b>

${timeframe} Minute

━━━━━━━━━━━━━━━━━━

আপনার Timeframe সফলভাবে সংরক্ষণ করা হয়েছে।

এখন এই Timeframe ব্যবহার করে Signal তৈরি করা হবে।
`;

        return ctx.editMessageText(message, {

            parse_mode: "HTML",
            ...settingsButtons()

        });

    } catch (error) {

        console.log(error);

        return ctx.answerCbQuery(
            "❌ কিছু সমস্যা হয়েছে!"
        );

    }

        }
/* =========================================
   BACK TO HOME
========================================= */

async function backHome(ctx) {

    const message = `
🏠 <b>AI Trading Signal Bot</b>

━━━━━━━━━━━━━━━━━━

🤖 Gemini Vision AI দ্বারা আপনার Trading Chart বিশ্লেষণ করা হবে।

নিচের একটি অপশন নির্বাচন করুন।

📈 Get Signal
⚙️ Settings
`;

    try {

        return ctx.editMessageText(message, {

            parse_mode: "HTML",
            ...startButtons()

        });

    } catch (err) {

        return ctx.reply(message, {

            parse_mode: "HTML",
            ...startButtons()

        });

    }

}

/* =========================================
   REGISTER SETTINGS CALLBACKS
========================================= */

function registerSettings(bot) {

    // Open Settings
    bot.action("settings", openSettings);

    // Back Home
    bot.action("home", backHome);

    // Timeframe Buttons
    bot.action(/^tf_(\d+)$/, saveTimeframe);

}

/* =========================================
   EXPORTS
========================================= */

module.exports = {

    openSettings,

    saveTimeframe,

    backHome,

    registerSettings

};
