const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
    static async build() {
        //open browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"]
        });

        //open a new page(tab)
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        //combine browser, page, custom page into 1 object called customPage by using Proxy
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

    async logIn() {
        const user = await userFactory();
        const { session, sig } = await sessionFactory(user);

        await this.page.setCookie({ name: "express:sess", value: session });

        await this.page.setCookie({
            name: "express:sess.sig",
            value: sig
        });

        await this.page.goto("http://localhost:3000/blogs");
        await this.page.waitFor('a[href="/auth/logout"]'); //wait for elemnt to load
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        return this.page.evaluate(_path => {
            return fetch(_path, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json());
        }, path);
    }

    post(path, data) {
        return this.page.evaluate(
            (_path, _data) => {
                return fetch(_path, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(_data)
                }).then(res => res.json());
            },
            path,
            data
        );
    }

    execRequests(actions) {
        return Promise.all(
            actions.map(({ method, path, data }) => {
                return this[method](path, data);
            })
        );
    }
}

module.exports = CustomPage;
