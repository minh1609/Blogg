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

//nested test
describe("When Log in", async () => {
    beforeEach(async () => {
        await page.logIn();
        await page.click("a.btn-floating");
    });

    test("can see blog created form", async () => {
        const label = await page.getContentsOf("form label");
        expect(label).toEqual("Blog Title");
    });

    describe("enter valid input", async () => {
        beforeEach(async () => {
            await page.type(".title input", "title");
            await page.type(".content input", "content");
            await page.click("form button");
        });
        test("submit take user to review screen", async () => {
            const text = await page.getContentsOf("h5");
            expect(text).toEqual("Please confirm your entries");
        });

        test("submitting then saving blog ", async () => {
            await page.click("button.green");
            await page.waitFor(".card");
            const title = await page.getContentsOf(".card-title");
            const content = await page.getContentsOf("p");

            expect(title).toEqual("title");
            expect(content).toEqual("content");
        });
    });

    describe("Enter invalid input", async () => {
        beforeEach(async () => {
            await page.click("form button");
        });

        test("show error message", async () => {
            const tittleErr = await page.getContentsOf(".title .red-text");
            const contentErr = await page.getContentsOf(".content .red-text");

            expect(tittleErr).toEqual("You must provide a value");
            expect(contentErr).toEqual("You must provide a value");
        });
    });
});

//directly send API request
describe("Not Log in", async () => {
    const actions = [
        {
            method: "get",
            path: "/api/blogs"
        },
        {
            method: "post",
            path: "/api/blogs",
            data: {
                title: "T",
                content: "C"
            }
        }
    ];

    test("Blog related actions are prohibited", async () => {
        const results = await page.execRequests(actions);

        for (let result of results) {
            expect(result).toEqual({ error: "You must log in!" });
        }
    });
});
