const { SMTPServer } = require("smtp-server");
const simpleParser = require("mailparser").simpleParser;
const path = require("path");
const fs = require("fs");
// Create SMTP server
const server = new SMTPServer({
  authOptional: true, // If you want authentication, set false
  onConnect(session, callback) {
    console.log("Client connected:", session.remoteAddress);
    callback(); // Accept connection
  },
  onMailFrom(address, session, callback) {
    console.log("Mail from:", address.address);
    callback(); // Accept sender
  },
  onRcptTo(address, session, callback) {
    console.log("Recipient:", address.address);
    callback(); // Accept recipient
  },
  onData(stream, session, callback) {
    console.log("Receiving email...");

    // Parse the email
    simpleParser(stream)
      .then(async (parsed) => {
        console.log("Subject:", parsed.subject);
        console.log("From:", parsed.from.text);
        console.log("To:", parsed.to.text);
        console.log("Body:", parsed.text);

        // Example: Save attachments
        if (parsed.attachments.length > 0) {
          parsed.attachments.forEach((att) => {
            const filePath = path.join(__dirname, "uploads", att.filename);
            fs.writeFileSync(filePath, att.content);
            console.log("Saved attachment:", att.filename);
          });
        }

        callback(); // Accept the message
      })
      .catch((err) => {
        console.error("Error parsing email:", err);
        callback(err);
      });
  },
  onClose(session) {
    console.log("Connection closed:", session.remoteAddress);
  },
});

// Start server
const PORT = 25; // Choose any port
server.listen(PORT, () => {
  console.log(`SMTP server listening on port ${PORT}`);
});
