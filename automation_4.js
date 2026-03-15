const puppeteer = require('puppeteer-core');

async function findTabByTitleOrUrl(pageArray, searchString) {
  for (let i = 0; i < pageArray.length; i++) {
    const page = pageArray[i];
    const title = await page.title();
    const url = await page.url();
    if (title.includes(searchString) || url.includes(searchString)) {
      return page;
    }
  }
  return null;
}

async function activateTab(page) {
  // console.log(`Activating tab with URL: ${page.url()}`);
  const session = await page.target().createCDPSession();
  await session.send('Page.bringToFront');
  await session.detach();
  // console.log(`Tab activated: ${page.url()}`);
}

async function sendTelegram(message) {
  // Get my Telegram bot (Linked Messenger) to message me
  const apiKey = "5927670817:AAFsEJ6U5NhWo1Fz6iVk7yEAk3iWhTyAWxw";
  const chatId = "1895015879";

  const url = `https://api.telegram.org/bot${apiKey}/sendMessage?chat_id=${chatId}&text=${message}`;
  fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Message sent:', data);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
}

/*
async function getFrameBySelector(page, selector) {
  const elementHandle = await page.$(selector);
  if (!elementHandle) {
    throw new Error(`No element matching selector "${selector}"`);
  }
  const frame = await elementHandle.contentFrame();
  if (!frame) {
    throw new Error(`No frame found for element with selector "${selector}"`);
  }
  return frame;
}
*/

async function autoScrollSearchResults(page, scrollableSectionSelector, scrollIncrement) {
  await page.waitForSelector(scrollableSectionSelector);

  const maxScrollHeight = await page.evaluate(selector => {
    const scrollableSection = document.querySelector(selector);
    return scrollableSection.scrollHeight - scrollableSection.clientHeight;
  }, scrollableSectionSelector);

  let currentScrollHeight = 0;
  while (currentScrollHeight < maxScrollHeight) {
    const newScrollHeight = Math.min(currentScrollHeight + scrollIncrement, maxScrollHeight);
    await page.evaluate(`document.querySelector("${scrollableSectionSelector}").scrollTo(0, ${newScrollHeight})`);
    await page.waitForTimeout(2000);
    currentScrollHeight = newScrollHeight;
  }

  await page.evaluate(`document.querySelector("${scrollableSectionSelector}").scrollTo(0, 0)`);
}

function getRandomDelay() {
  return Math.floor(Math.random() * (3500 - 2000 + 1) + 2000);
}

(async () => {
  // Visit http://127.0.0.1:9222/json/version to get the current webSocketDebuggerUrl
  // Before visiting that URL, make sure Chrome was launched with the `--remote-debugging-port=9222` flag.
  // "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
  // Do NOT use `localhost` because it can resolve to different IP addresses, including ::1,
  // which is the IPv6 loopback address for the local machine.
  // This can result in "Failed to fetch browser webSocket URL" error.
  // Always use `127.0.0.1`, which is the IPv4 loopback address.
  const browserURL = 'ws://127.0.0.1:9222/devtools/browser/12ecd318-e004-460a-88a7-8577369ac736';
  const browser = await puppeteer.connect({ browserWSEndpoint: browserURL, defaultViewport: null });

  const pages = await browser.pages();

  const page = await findTabByTitleOrUrl(pages, "https://www.google.com");
  await activateTab(page);

/////////////////////////////////


  const linkSelector = 'body > div.L3eUgb > div.o3j99.n1xJcf.Ne6nSd > a';
  const links = await page.$$(linkSelector);

  console.log("Number of links found:", links.length);

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    console.log("Link index:", i, "Link href:", await link.evaluate(link => link.href));
    await link.click({ button: 'middle' });
    console.log("Link clicked:", i);
    await page.waitForTimeout(1000);
  }



/////////////////////////////////

})();
