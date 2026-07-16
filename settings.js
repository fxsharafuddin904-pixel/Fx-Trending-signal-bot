const { settingsButtons, startButtons } = require("./buttons");
const { getUser, updateUser } = require("./database");

// ===============================
// Settings Menu
// ===============================

async function openSettings(ctx) {

    const user = getUser(ctx.from.id);

    await ctx.editMessageText(

`⚙️ <b>Settings Panel</b>

━━━━━━━━━━━━━━━━━━

⏱ বর্তমান Timeframe

<b>${user.timeframe} Minute</b>

━━━━━━━━━━━━━━━━━━

নিচের বাটন থেকে নতুন একটি Timeframe নির্বাচন করুন।`,

        {
            parse_mode: "HTML",
            ...settingsButtons()
        }

    );

}



// ===============================
// Save Timeframe
// ===============================

async function saveTimeframe(ctx, timeframe) {

    updateUser(ctx.from.id, {

        timeframe: timeframe

    });

    await ctx.answerCbQuery(
        `✅ ${timeframe} Minute Selected`
    );

    await ctx.editMessageText(

`✅ <b>Settings Updated</b>

━━━━━━━━━━━━━━━━━━

⏱ নতুন Timeframe

<b>${timeframe} Minute</b>

━━━━━━━━━━━━━━━━━━

আপনার সেটিং সফলভাবে সংরক্ষণ করা হয়েছে।`,

        {
            parse_mode: "HTML",
            ...settingsButtons()
        }

    );

}



// ===============================
// Back Home
// ===============================

async function backHome(ctx) {

    await ctx.editMessageText(

`👋 <b>স্বাগতম</b>

📈 <b>AI Trading Signal Bot</b>

━━━━━━━━━━━━━━━━━━

Gemini AI আপনার চার্ট বিশ্লেষণ করবে এবং Premium Trading Report প্রদান করবে।

নিচের একটি অপশন নির্বাচন করুন।`,

        {
            parse_mode: "HTML",
            ...startButtons()
        }

    );

}



// ===============================
// Register All Callback
// ===============================

function registerSettings(bot) {

    bot.action("settings", openSettings);

    bot.action("back_home", backHome);

    for (let i = 1; i <= 5; i++) {

        bot.action(`tf_${i}`, (ctx) => {

            return saveTimeframe(ctx, i);

        });

    }

}

module.exports = {

    registerSettings

};
