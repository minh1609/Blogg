//jest looking for all file .test.js to run

const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");
const Page = require("./helper/page");

let page;

//run before each test
beforeEach(async () => {
    page = await Page.build();
    await page.goto("localhost:3000");
});

//close browser run after test
afterEach(async () => {
    await page.close();
});

//Log in to app by set cookie for page
logIn = async page => {
    //my cookie when I log in by Google ID
    await page.setCookie({
        name: "express:sess",
        value:
            "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWQxNmU1NDM5ZWEwYmIyZWEwMmRkM2Y0In19"
    });
    await page.setCookie({
        name: "express:sess.sig",
        value: "Mgc2MrAFKnWx5oXz9jUZOFnKkEk"
    });
    await page.goto("localhost:3000");
};

test("header has correct text", async () => {
    const text = await page.$eval("a.brand-logo", el => el.innerHTML);

    expect(text).toEqual("Blogster");
});

test("Go to Google Oauth", async () => {
    await page.click(".right a");

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});

test("Show logout button when signed in", async () => {
    logIn(page);

    await page.waitFor('a[href="/auth/logout"]'); //wait for elemnt to load
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual("Logout");
});
