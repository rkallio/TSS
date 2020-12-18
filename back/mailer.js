const sendmail = require('sendmail')(); //now goes with default values
//if dkim is needed edit require require('sendmail')(dkim:'',)

const sendEmail = function(message, emailAddress, opts) {
  try {
    const toMail = emailAddress;
    const subject = 'Tasera info';
    //defaults message to command if for some reason fails in switch
    let text = message;


    switch (message) {
    case 'assigned':
      text = 'Hei, teille on annettu valvojavuoro. Voitte nyt käydä vahvistamassa vuoronne. Terveisin TASERA ry';
      break;
    case 'update':
      text = 'Hei, teille annettua valvojavuoroa on muutettu. Voitte nyt käydä tarkistamassa vuoronne. Terveisin TASERA ry';
      break;
    case 'decline':
      text = 'Hei, ' + opts.user + ' perui päävalvojavuoronsa päivältä ' + opts.date + '. Päävalvoja pitää vaihtaa mitä pikimmiten. Terveisin TASERA ry';
      break;
    case 'feedback':
      text = 'Hei, ' + opts.user + ' lähetti juuri palautteen:\n\n' + opts.feedback + '\n\nTerveisin TASERA ry';
      break;
    }

    sendmail({
      from: process.env.SENDER_EMAIL,
      to: toMail,
      subject: subject,
      html: text,
    }, function(err) {
      console.log(err && err.stack);
    });
  }catch (error){
    console.error(error);
  }

};
module.exports = sendEmail;