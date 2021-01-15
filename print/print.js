const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const ejs = require('ejs');
var self = module.exports = {
    getFile: async function (templateName, data) {
        const filepath = "./print/templates/" + `${templateName}.ejs`;//path.join(process.cwd(), 'templates', `${templateName}.hbs`);
        console.log("PATH : " + filepath);
        const html = await fs.readFile(filepath, 'utf-8');
        let content = ejs.render(html, data);
        return content;
    },
    print: async function (template, data, path) {
        console.log("CONTENT LOADING.... ");
        const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        //console.log("CONTENT LOADING.... ");
        const content = await self.getFile(template, data);
        //console.log("CONTENT : " + content);
        //await page.goto('https://kstreaming.one/s-w-a-t-saison-2-0706/16/', { waitUntil: 'networkidle2' });
        page.setContent(content);
        await page.emulateMediaFeatures('screen');
        await page.addStyleTag({ path: "./print/templates/print.css" });
        await page.pdf({ path: path, format: 'A4', printBackground: true, });
        await browser.close();
        console.log("Done...");
    },
    printPDF: async function () {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://blog.risingstack.com', { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();
        return pdf
    }
}