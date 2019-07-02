const puppeteer = require("puppeteer");

class CustomPage {
    static async build() {
        //open browser
        const browser = await puppeteer.launch({
            headless: false
        });

        //open a new page(tab)
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        //combine browser, page, custom page into 1 object called customPage

        //For example:
        //if we calll customePage.close.Firstly, program takes a look at page object, if page has property called "close", run page.close,
        //  if not, move to browser, if browser has this property, run browser.close
        return new Proxy(customPage, {
            get: function(target, property) {
                return (
                    customPage[property] || browser[property] || page[property]
                );
            }
        });
    }

    constructor(page) {
        this.page = page;
    }
}

module.exports = CustomPage;
