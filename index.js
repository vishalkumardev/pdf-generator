const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.json());

// Function to generate PDF certificate

// Route to generate PDF certificate
app.post("/generate-certificate", async (req, res) => {
  const { name, course } = req.body;

  try {
    // Generate the PDF

    const content = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Certificate of Achievement</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Lora:wght@400;500&family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <style>
          body {
            font-family: "Lora", serif;
          }
          h1,
          h2,
          h3 {
            font-family: "Montserrat", sans-serif;
          }
          .signature {
            font-family: "Dancing Script", cursive;
            font-size: 1.5rem;
          }
        </style>
      </head>
      <body class="bg-white flex items-center justify-center h-screen">
        <div class="bg-white max-w-6xl w-full p-8 md:p-20 relative rounded-lg">
          <div class="absolute top-0 left-0 w-full h-8 bg-yellow-500 transform -skew-y-1"></div>
          <div class="absolute bottom-0 left-0 w-full h-8 bg-yellow-500 transform -skew-y-1"></div>
          <div class="absolute top-0 left-0 w-full h-4 bg-blue-900 transform -skew-y-1" style="margin-top: -1.5rem"></div>
          <div class="absolute bottom-0 left-0 w-full h-4 bg-blue-900 transform -skew-y-1" style="margin-bottom: -1.5rem"></div>
  
          <div class="text-center mt-4">
            <h1 class="text-5xl font-bold text-gray-800">Certificate of Completion</h1>
            <p class="mt-4 text-lg text-gray-600">This certificate is proudly awarded to</p>
            <h2 class="text-2xl font-semibold text-gray-800 mt-4 italic">${name}</h2>
  
            <p class="mt-4 text-lg text-gray-600">for successfully completing the course</p>
            <h3 class="text-2xl font-medium text-gray-800 mt-2">${course}</h3>
  
            <p class="mt-4 text-gray-600 text-sm max-w-xl mx-auto">
              Congratulations on your hard work and dedication. We are confident that the skills you've gained will contribute to your future success.
              Wishing you the very best as you continue your learning journey and apply your newfound knowledge to achieve your goals.
            </p>
  
            <div class="flex items-center justify-center mt-8">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9521/9521731.png"
                alt="Seal"
                class="w-28 h-20 object-contain"
              />
            </div>
  
            <div class="flex justify-between mt-12 text-center">
              <div>
                <p class="text-gray-600 font-medium">License ID</p>
                <p class="text-gray-800 font-semibold">#LC123456</p>
              </div>
  
              <div>
                <p class="signature text-gray-800">LearnCodes</p>
                <div class="border-t-2 border-gray-400 w-32 mx-auto mb-1"></div>
                <p class="text-gray-600 font-medium">Team LearnCodes</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    // Set the content of the page to the received HTML
    await page.setContent(content);

    const outputPath = path.join(__dirname, "uploads", `${Date.now()}.pdf`);

    // Generate PDF
    await page.pdf({
      format: "A4",
      landscape: true,
      path: outputPath,
      printBackground: true,
    });

    // Send the file to the client
    res.set({
      "Content-Type": "application/pdf",
    });
    res.sendFile(outputPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("An error occurred while sending the file.");
      } else {
        // Clean up: Delete the file after sending it
        fs.unlink(outputPath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("An error occurred while generating the certificate.");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
