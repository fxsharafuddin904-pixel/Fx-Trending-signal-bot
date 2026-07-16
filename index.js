const { Telegraf } = require("telegraf");

const config = require("./config");

const {
    startButtons
} = require("./buttons");

const {
    getUser
} = require("./database");

const {
    registerSettings
} = require("./settings");

const {
    registerSignal
} = require("./signal");

/* =========================================
   CREATE BOT
========================================= */

const bot = new Telegraf(
    config.BOT_TOKEN
);

/* =========================================
   START COMMAND
========================================= */

bot.start(async (ctx) => {

    // Create User
    getUser(ctx.from.id);

    const message = `
👋 <b>স্বাগতম!</b>

📈 <b>AI Trading Signal Bot</b>

━━━━━━━━━━━━━━━━━━

🤖 Gemini Vision AI ব্যবহার করে আপনার Trading Chart বিশ্লেষণ করা হবে।

✨ Features

• AI Chart Analysis
• Premium Signal
• Confidence Score
• Entry Price
• Stop Loss
• Take Profit

━━━━━━━━━━━━━━━━━━

নিচের একটি অপশন নির্বাচন করুন।
`;

    return ctx.reply(message, {

        parse_mode: "HTML",

        ...startButtons()

    });

});

/* =========================================
   REGISTER MODULES
========================================= */

registerSettings(bot);

registerSignal(bot);

/* =========================================
   UNKNOWN COMMAND
========================================= */

bot.on("text", async (ctx) => {

    if (
        ctx.message.text.startsWith("/")
    ) {

        return ctx.reply(

            "❌ এই Command টি পাওয়া যায়নি।"

        );

    }

});
/* =========================================
   PHOTO VALIDATION
========================================= */

bot.on("photo", async (ctx, next) => {

    try {

        const user = getUser(ctx.from.id);

        if (user.step !== "waiting_screenshot") {

            return ctx.reply(

`❌ আগে <b>Get Signal</b> এ ক্লিক করে Market নির্বাচন করুন।`,

                {
                    parse_mode: "HTML",
                    ...startButtons()
                }

            );

        }

        return next();

    } catch (error) {

        console.log(error);

        return ctx.reply(
            "❌ একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।"
        );

    }

});

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

bot.catch(async (err, ctx) => {

    console.log("BOT ERROR");
    console.log(err);

    try {

        await ctx.reply(

`❌ <b>Unexpected Error</b>

Bot-এ একটি সমস্যা হয়েছে।

অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।`,

            {
                parse_mode: "HTML"
            }

        );

    } catch (e) {

        console.log(e);

    }

});

/* =========================================
   START BOT
========================================= */

bot.launch()
    .then(() => {

        console.log("━━━━━━━━━━━━━━━━━━━━");
        console.log("🤖 AI Trading Signal Bot");
        console.log("✅ Bot Started Successfully");
        console.log("━━━━━━━━━━━━━━━━━━━━");

    })
    .catch((error) => {

        console.log("Launch Error:", error);

    });

/* =========================================
   GRACEFUL STOP
========================================= */

process.once("SIGINT", () => {

    console.log("Bot Stopped (SIGINT)");

    bot.stop("SIGINT");

});

process.once("SIGTERM", () => {

    console.log("Bot Stopped (SIGTERM)");

    bot.stop("SIGTERM");

});
/* =========================================
   UNHANDLED PROMISE REJECTION
========================================= */

process.on("unhandledRejection", (reason) => {

    console.error("━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Unhandled Promise");
    console.error(reason);
    console.error("━━━━━━━━━━━━━━━━━━━━");

});

/* =========================================
   UNCAUGHT EXCEPTION
========================================= */

process.on("uncaughtException", (error) => {

    console.error("━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ Uncaught Exception");
    console.error(error);
    console.error("━━━━━━━━━━━━━━━━━━━━");

});

/* =========================================
   BOT INFORMATION
========================================= */

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 AI Trading Signal Bot

🚀 Status : Online
🧠 AI : Gemini Vision
⚡ Framework : Telegraf
💾 Database : JSON
🌐 Deploy : Railway Ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

/* =========================================
   KEEP RAILWAY ALIVE
========================================= */

setInterval(() => {

    console.log(
        `[${new Date().toLocaleTimeString()}] Bot Running...`
    );

}, 1000 * 60 * 30);

/* =========================================
   END OF FILE
========================================= */
