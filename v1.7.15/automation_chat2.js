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
  const session = await page.target().createCDPSession();
  await session.send('Page.bringToFront');
  await session.detach();
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

(async () => {
  // Visit http://127.0.0.1:9222/json/version to get the current webSocketDebuggerUrl
  // Do NOT use `localhost` because it can resolve to different IP addresses, including ::1,
  // which is the IPv6 loopback address for the local machine.
  // This can result in "Failed to fetch browser webSocket URL" error.
  // Always use `127.0.0.1`, which is the IPv4 loopback address.
  const browserURL = 'ws://127.0.0.1:9222/devtools/browser/49e82833-c22a-4b15-848e-eff3675fa2b8';
  const browser = await puppeteer.connect({ browserWSEndpoint: browserURL, defaultViewport: null });

  const pages = await browser.pages();

  while (true) {
    const page = await findTabByTitleOrUrl(pages, 'https://www.mydomain.com/pages/');
    if (!page) {
      break;
    }

    activateTab(page);

    // Wait for the page to load and #SNF-doc-height to appear
    //await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('#SNF-doc-height');

    // Move the mouse to the menuTrigger element and click it
    const menuTrigger = await page.waitForSelector('#profile-card-section > section[class^=_header] > div[class^=_actions-container] > section[class^=_actions-bar] > button');
    await menuTrigger.hover();
    await page.waitForTimeout(2500);
    await menuTrigger.click();

    // Wait for the menu item to appear and click it
    await page.waitForSelector('#hue-web-menu-outlet ul li a', { visible: true });

    // Move the mouse to the element with the selector #hue-web-menu-outlet ul li that contains the text "Copy URL"
    const copyButton = await page.waitForXPath('//li/button/div/div[contains(.,"Copy")]');
    await page.waitForTimeout(1111);
    await copyButton.hover();
    await page.waitForTimeout(444);

    // Click the copyButton
    await copyButton.click();

    // Copy the text and verify the clipboard contents
    await page.waitForSelector('#SNF-copy');
    await page.waitForTimeout(222);
    await page.click('#SNF-copy');
    await page.waitForSelector('#SNFc-success');
    await page.waitForTimeout(444);
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    if (clipboardContent.includes("https://www.mydomain.com/pages/")) {
      console.log('Clipboard content is correct');

      // Close the current tab
      await page.close();

      // bring Google Sheets tab to front
      const sheetsPage = await findTabByTitleOrUrl(pages, 'docs.google.com/spreadsheets');
      if (!sheetsPage) {
        console.log('Google Sheets tab not found');
        break;
      }
      await activateTab(sheetsPage);

      // paste clipboard contents and move down one cell
      console.log('Pasting clipboard contents and moving down one cell');
      await sheetsPage.waitForTimeout(1111);
      await sheetsPage.keyboard.down('Control');
      await sheetsPage.keyboard.press('KeyV');
      await sheetsPage.keyboard.up('Control');
      await sheetsPage.waitForTimeout(3333);
      await sheetsPage.keyboard.press('ArrowDown');
      await sheetsPage.waitForTimeout(1111);

      // update the list of open tabs
      const updatedPages = await browser.pages();
      pages.length = 0;
      pages.push(...updatedPages);
    } else {
      console.log('Clipboard content is incorrect');
      sendTelegram("Incorrect clipboard content. Need intervention!");
      break;
    }
  }

  await browser.close(); // This will close the connection to the browser, but not the browser window itself.

})();
