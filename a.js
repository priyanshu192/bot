const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
const { resolve } = require('path');
const moment = require("moment-timezone");
  var gio = moment.tz("Asia/KOLKATA").format("HH:mm:ss");
async function downloadMusicFromYoutube(link, path) {
  var timestart = Date.now();
  if(!link) return 'Thiếu link'
  var resolveFunc = function () { };
  var rejectFunc = function () { };
  var returnPromise = new Promise(function (resolve, reject) {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
    ytdl(link, { filter: "videoandaudio" }).pipe(fs.createWriteStream(path))
        .on("close", async () => {
            var data = await ytdl.getInfo(link)
            var result = {
                title: data.videoDetails.title,
                dur: Number(data.videoDetails.lengthSeconds),
                viewCount: data.videoDetails.viewCount,
                likes: data.videoDetails.likes,
                uploadDate: data.videoDetails.uploadDate,
                sub: data.videoDetails.author.subscriber_count,
                author: data.videoDetails.author.name,
                timestart: timestart
            }
            resolveFunc(result)
        })
  return returnPromise
}
module.exports.config = {
    name: "video",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Play music via YouTube link or search keyword",
    commandCategory: "Utilities",
    usages: "[searchMusic]",
    cooldowns: 0
}

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/KOLKATA").format("HH:mm:ss");
    const axios = require('axios')
    const { createReadStream, unlinkSync, statSync } = require("fs-extra")
    try {
        var path = `${__dirname}/cache/sing-${event.senderID}.mp4`
        var data = await downloadMusicFromYoutube('https://www.youtube.com/watch?v=' + handleReply.link[event.body -1], path);
        if (fs.statSync(path).size > 46214400) return api.sendMessage('𝐓𝐡𝐞 𝐟𝐢𝐥𝐞 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐛𝐞 𝐬𝐞𝐧𝐭 𝐛𝐞𝐜𝐚𝐮𝐬𝐞 𝐢𝐭 𝐢𝐬 𝐥𝐚𝐫𝐠𝐞𝐫 𝐭𝐡𝐚𝐧 𝟰𝟲𝐌𝐁', event.threadID, () => fs.unlinkSync(path), event.messageID);
        api.unsendMessage(handleReply.messageID)
        return api.sendMessage({ 
            body: `🎶=====「 𝗩𝗶𝗱𝗲𝗼 」=====️🎶\n━━━━━━━━━━━━━━\n📌 → 𝗧𝗶𝘁𝗹𝗲: ${data.title} ( ${this.convertHMS(data.dur)} )\n📆 → 𝗨𝗽𝗹𝗼𝗮𝗱 𝗗𝗮𝘁𝗲: ${data.uploadDate}\n📻 → 𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${data.author}\n🎉 → 𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗯𝗲𝗿: ${data.sub}\n👀 → 𝗧𝗼𝘁𝗮𝗹 𝗩𝗶𝗲𝘄𝘀: ${data.viewCount} 𝘃𝗶𝗲𝘄\n⏳ → 𝗧𝗶𝗺𝗲 𝗧𝗮𝗸𝗲𝗻́: ${Math.floor((Date.now()- data.timestart)/1000)} 𝗦𝗲𝗰𝗼𝗻𝗱𝘀\n======= [ ${time} ] =======`,
            attachment: fs.createReadStream(path)}, event.threadID, ()=> fs.unlinkSync(path), 
         event.messageID)

    }
    catch (e) { return console.log(e) }
}
module.exports.convertHMS = function(value) {
    const sec = parseInt(value, 10); 
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (hours != '00' ? hours +':': '') + minutes+':'+seconds;
}
module.exports.run = async function ({ api, event, args }) {
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/KOLKATA").format("HH:mm:ss");
  let axios = require('axios');
    if (args.length == 0 || !args) return api.sendMessage('»❗𝐓𝐡𝐢𝐬 𝐟𝐢𝐥𝐞 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐛𝐞 𝐬𝐞𝐧𝐭.', event.threadID, event.messageID);
    const keywordSearch = args.join(" ");
    var path = `${__dirname}/cache/sing-${event.senderID}.mp4`
    if (fs.existsSync(path)) { 
        fs.unlinkSync(path)
    }
    if (args.join(" ").indexOf("https://") == 0) {
        try {
            var data = await downloadMusicFromYoutube(args.join(" "), path);
            if (fs.statSync(path).size > 4621440000) return api.sendMessage('𝐓𝐡𝐞 𝐟𝐢𝐥𝐞 𝐜𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐛𝐞 𝐬𝐞𝐧𝐭 𝐛𝐞𝐜𝐚𝐮𝐬𝐞 𝐢𝐭 𝐢𝐬 𝐥𝐚𝐫𝐠𝐞𝐫 𝐭𝐡𝐚𝐧 𝟰𝟲𝐌𝐁.', event.threadID, () => fs.unlinkSync(path), event.messageID);
            return api.sendMessage({ 
                body: `🎶=====「 𝗩𝗶𝗱𝗲𝗼 」=====️🎶\n━━━━━━━━━━━━━━\n📌 → 𝗧𝗶𝘁𝗹𝗲: ${data.title} ( ${this.convertHMS(data.dur)} )\n📆 → 𝗨𝗽𝗹𝗼𝗮𝗱 𝗗𝗮𝘁𝗲: ${data.uploadDate}\n📻 → 𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${data.author}\n🎉 → 𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗯𝗲𝗿: ${data.sub}\n👀 → 𝗧𝗼𝘁𝗮𝗹 𝗩𝗶𝗲𝘄𝘀: ${data.viewCount} 𝘃𝗶𝗲𝘄\n⏳ → 𝗧𝗶𝗺𝗲 𝗧𝗮𝗸𝗲𝗻́: ${Math.floor((Date.now()- data.timestart)/1000)} 𝗦𝗲𝗰𝗼𝗻𝗱𝘀\n======= [ ${time} ] =======`,
                attachment: fs.createReadStream(path)}, event.threadID, ()=> fs.unlinkSync(path), 
            event.messageID)

        }
        catch (e) { return console.log(e) }
    } else {
          try {
            var link = [],
                msg = "",
                num = 0,
                numb = 0;
            var imgthumnail = []
            const Youtube = require('youtube-search-api');
            var data = (await Youtube.GetListByKeyword(keywordSearch, false,6)).items;
            for (let value of data) {
              link.push(value.id);
              let folderthumnail = __dirname + `/cache/${numb+=1}.png`;
                let linkthumnail = `https://img.youtube.com/vi/${value.id}/hqdefault.jpg`;
                let getthumnail = (await axios.get(`${linkthumnail}`, {
                    responseType: 'arraybuffer'
                })).data;
                  let datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=AIzaSyBPdGN3eMhswfSKWoaomzdlEftf3NjV1gM`)).data;
                     fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, 'utf-8'));
              imgthumnail.push(fs.createReadStream(__dirname + `/cache/${numb}.png`));
              let channel = datac.items[0].snippet.channelTitle;
              num = num+=1
  if (num == 1) var num1 = "𝟙. "
  if (num == 2) var num1 = "𝟚. "
  if (num == 3) var num1 = "𝟛. "
  if (num == 4) var num1 = "𝟜. "
  if (num == 5) var num1 = "𝟝. "
  if (num == 6) var num1 = "𝟞. "

              msg += (`${num1} - ${value.title} ( ${value.length.simpleText} )\n📻 → 𝗖𝗵𝗮𝗻𝗻𝗲𝗹: ${channel}\n━━━━━━━━━━━━━━\n`);
            }
            var body = `»🔎 𝐒𝐞𝐚𝐫𝐜𝐡 𝐒𝐮𝐜𝐜𝐞𝐬𝐬! 𝐓𝐡𝐞𝐫𝐞 𝐚𝐫𝐞 ${link.length} 𝐒𝐨𝐧𝐠:\n━━━━━━━━━━━━━━\n${msg}» 𝐎𝐫 𝐫𝐞𝐩𝐥𝐲 (𝐩𝐚𝐫𝐭𝐢𝐜𝐢𝐩𝐚𝐭𝐞) 𝐭𝐨 𝐜𝐡𝐨𝐨𝐬𝐞 𝐨𝐧𝐞 𝐢𝐧 𝐲𝐨𝐮𝐫 𝐡𝐞𝐚𝐫𝐭`
            return api.sendMessage({
              attachment: imgthumnail,
              body: body
            }, event.threadID, (error, info) => global.client.handleReply.push({
              type: 'reply',
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              link
            }), event.messageID);
          } catch(e) {
            return api.sendMessage('An error occurred, please try again in a moment!!\n' + e, event.threadID, event.messageID);
        }
    }
                               }