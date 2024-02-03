const process = require('process');
const commands = require('./commands/index.js');

function bash() {
   process.stdout.write("prompt > ");

   process.stdin.on("data" , (data) => {
      let args = data.toString().trim().split(" ");
      let cmd = args[0];
      if (commands[cmd]) {
         commands[cmd](print, args.slice(1).join(" "));
      } else {
         print("command not found: " + cmd);
      }
   })

}

const print = (output) => {
   process.stdout.write(output);
   process.stdout.write("\nprompt > ");
}

bash();
module.exports = {
   print,
   bash,
};

