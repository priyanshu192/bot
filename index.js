const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const Monitor = require('ping-monitor');
const monitor = new Monitor({
    address: '127.0.0.1',
    port: 5000, 
    interval: 10, 
  config: {
    intervalUnits: 'seconds'
  },
    httpOptions: {
      path: '/users',
      method: 'post',
      query: {
        first_name: 'Priyansh',
        last_name: 'Rajput'
      },
      body: 'Hello World!'
    },
    expect: {
      statusCode: 200
    }
});

monitor.on('up', (res) => logger(`${res.address}:${res.port} IS  ONLINE!!`, "[ UPTIME BY ℙ𝕣𝕚𝕪𝕒𝕟𝕤𝕙]"));
monitor.on('down', (res) => console.log(`${res.address} ${res.statusMessage}`));
monitor.on('stop', (website) => console.log(`${website}`) );
monitor.on('error', (error) => console.log(error));
monitor.on('up', (res) => logger(`Credit: ℙ𝕣𝕚𝕪𝕒𝕟𝕤𝕙`, "[ File Owner ]"));
monitor.on('up', (res) => logger(`I hope you have a good day today idol btw thanks for using my file bot idol`, "[ Priyansh ]"));
/////////////////////////////////////////////
//========= Check node.js version =========//
/////////////////////////////////////////////

// const nodeVersion = semver.parse(process.version);
// if (nodeVersion.major < 13) {
//     logger(`Your Node.js ${process.version} is not supported, it required Node.js 13 to run bot!`, "error");
//     return process.exit(0);
// };

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

/*const dashboard = http.createServer(function (_req, res) {
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.write("HI! THIS BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯");
    res.end();
});

dashboard.listen(process.env.port || 0);*/
const express = require('express');
const app = express();

const port = process.env.PORT || 5000
// const port = 5000
     
app.listen(port, () =>
	logger(`Your app is listening a http://localhost:${port}`, "[ ONLINE ]")
     );      


logger("Opened server site...", "[ Starting ]");
logger("Opening Uptime Monitor by Priyansh ...", "[ Starting ]")

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

function startBot(message) {
    (message) ? logger(message, "[ Starting ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Choru-Mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

  /*child.on("close",async (codeExit) => {
      var x = 'codeExit'.replace('codeExit',codeExit);
        if (codeExit == 1) return startBot("Restarting...");
         else if (x.indexOf(2) == 0) {
           await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2,'')) * 1000));
                 startBot("Open ...");
       }
         else return; 
    });*/
  child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Starting up...");
            global.countRestart += 1;
            return;
        } else return;
    });

  child.on("error", function(error) {
    logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
  });
};
////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////


axios.get("https://raw.githubusercontent.com/ChoruTiktokers182/Choru-bypass/main/package.json").then((res) => {
  logger(res['data']['name'], "[ NAME ]");
  logger("Version: " + res['data']['version'], "[ VERSION ]");
  logger(res['data']['description'], "[ DESCRIPTION ]");
});
startBot();
/*axios.get("https://raw.githubusercontent.com/Shiron-Official/miraiv2/main/package.json").then((res) => {
    const local = JSON.parse(readFileSync('./package.json'));
    if (semver['lt'](local.version, res['data']['version'])) {
        if (local.autoUpdate == !![]) {
            logger('A new update is available, start update processing...', '[ UPDATE ]');
            const updateBot = {};
            updateBot.cwd = __dirname
            updateBot.stdio = 'inherit'
            updateBot.shell = !![];
            const child = spawn('node', ['update.js'], updateBot);
            child.on('exit', function () {
                return process.exit(0);
            })
            child.on('error', function (error) {
                logger('Unable to update:' + JSON.stringify(error), '[ CHECK UPDATE ]');
            });
        } else logger('A new update is available! Open terminal/cmd and type "node update" to update!', '[ UPDATE ]'),
        startBot();
    } else logger('You are using the latest version!', '[ CHECK UPDATE ]'), startBot();
}).catch(err => logger("Unable to check update.", "[ CHECK UPDATE ]"));*/
// THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
app.get('/', (req, res) => //res.send('YAHALLO!!'));
res.sendFile(__dirname+'/index.html'))