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


(async () => {
  const browserURL = 'ws://127.0.0.1:9222/devtools/browser/49e82833-c22a-4b15-848e-eff3675fa2b8';
  const browser = await puppeteer.connect({ browserWSEndpoint: browserURL, defaultViewport: null });

  const pages = await browser.pages();

  const page = await findTabByTitleOrUrl(pages, 'https://www.linkedin.com/sales/lead');
  if (page) {
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
    const copyUrlMenuItem = await page.waitForXPath('//li[contains(button/div/div/text(), "Copy URL")]');
    await copyUrlMenuItem.hover();
    await page.waitForTimeout(333);

    // Click the copyUrlMenuItem
    await copyUrlMenuItem.click();
  }

/*
  while (true) {
    const page = await findTabByTitleOrUrl(pages, 'https://www.linkedin.com/sales/lead');
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
    await page.waitForTimeout(500);
    await menuTrigger.click();

    // Wait for the menu item to appear and click it
    await page.waitForSelector('#hue-web-menu-outlet ul li a', { visible: true });
    // const menuItemContainer = await menuItem.$('..');
    // await menuItemContainer.hover();
    // await page.waitForTimeout(333);
    // await menuItem.click();

    // Move the mouse to the element with the selector #hue-web-menu-outlet ul li that contains the text "Copy URL"
    const copyUrlMenuItem = await page.waitForXPath('//li[contains(text(), "Copy LinkedIn.com URL")]');
    await copyUrlMenuItem.hover();
    await page.waitForTimeout(333);

    // Click the copyUrlMenuItem
    await copyUrlMenuItem.click();

    break;


    // Close the current tab
    // await page.close();


/!*
    // bring Google Sheets tab to front
    const sheetsPage = await findTabByTitleOrUrl(pages, 'docs.google.com/spreadsheets');
    if (!sheetsPage) {
      console.log('Google Sheets tab not found');
      break;
    }
    await activateTab(sheetsPage);

    // paste clipboard contents and move down one cell
    console.log('Pasting clipboard contents and moving down one cell');
    // TODO: implement clipboard access and cell navigation

    // update the list of open tabs
    const updatedPages = await browser.pages();
    pages.length = 0;
    pages.push(...updatedPages);
    ///////////////////////////
*!/

  }
*/

  // await browser.close();
})();
