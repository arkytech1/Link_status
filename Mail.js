const nodemailer = require('nodemailer');

var sendmail = function SendMail(content) {
	var subj  = '['+new Date().toLocaleString().substring(0, 9)+'] IMPORTANT ALERT : Weather Videos'
	nodemailer.createTestAccount((err, account) => {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: 'smtp.euronews.lan',
			port: 25,
			secure: false, // true for 465, false for other ports
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"Monitoring Euronews" <Monitoring@euronews.com>', // sender address
			to: 'khaled.arfaoui@ext.euronews.com, remi.le-monnier@ext.euronews.com', // list of receivers
			subject: subj, // Subject line
			html: content // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			// console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		});
	});
}
module.exports.sendmail = sendmail;