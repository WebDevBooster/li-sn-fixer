const puppeteer = require('puppeteer-core');

(async () => {
  const browserURL = 'ws://127.0.0.1:9222/devtools/browser/49e82833-c22a-4b15-848e-eff3675fa2b8';
  const browser = await puppeteer.connect({ browserWSEndpoint: browserURL, defaultViewport: null });

/*
  const pages = await browser.pages();
  let targetTabIndex = -1;

  for (let i = 0; i < pages.length; i++) {
    const title = await pages[i].title();
    if (title.includes("Google Sheets")) {
      targetTabIndex = i;
      console.log("targetTabIndex: ", targetTabIndex);
      break;
    }
  }

  if (targetTabIndex !== -1) {
    const targetPage = pages[targetTabIndex];
    await targetPage.bringToFront();
  } else {
    console.log('Could not find page with title "my page"');
  }
*/

  const pages = await browser.pages();

/*
  const targets = await browser.targets();
  const urls = [];

  for (const target of targets) {
    if (target.type() === 'page' || target.type() === 'frame') {
      const page = await target.page();
      if (page) {
        const url = page.url();
        urls.push(url);
      }
    }
  }

  console.log(urls);
*/

/*
  const targets = await browser.targets();
  let sheetsIndex = -1;
  const leadsIndexesArray = [];

  for (const target of targets) {
    if (target.type() === 'page') {
      const page = await target.page();
      if (page.url().includes("docs.google.com/spreadsheets")) {
        sheetsIndex = await pages.indexOf(page);
        console.log("sheetsIndex: ", sheetsIndex);
        console.log("URL: ", pages[sheetsIndex].url());
      } else if (page.url().includes("www.linkedin.com/sales/lead")) {
        const leadTabIndex = await pages.indexOf(page);
        console.log("leadTabIndex: ", leadTabIndex);
        console.log("URL: ", pages[leadTabIndex].url());
        leadsIndexesArray.push(leadTabIndex);
      }
    }
  }

  console.log("leadsIndexesArray: ", leadsIndexesArray);
*/

  const targets = await browser.targets();
  const target = targets.find(t => t.type() === 'page' && t.url().includes('docs.google.com/spreadsheets'));
  const page = await target.page();
  await page.bringToFront();


  /*
    const currentPage = await browser.targets()[0].page(); // assuming first target is current page

    const currentIndex = await pages.indexOf(currentPage);
    console.log("currentIndex: ", currentIndex);
    const nextIndex = (currentIndex + 1) % pages.length; // wrap around to the first tab if at the last tab
    console.log("nextIndex: ", nextIndex);
    const nextPage = pages[nextIndex];

    await nextPage.bringToFront();
  */


  /*
    const numberOfTabs = pages.length;
    const tab = pages[numberOfTabs - 1];


    // Switch to the target tab and wait for it to load
    await tab.bringToFront();
  */

  // Paste the clipboard contents into the selected cell
  // await page.focus('#selected-cell');
  // await page.keyboard.down('Control');
  // await page.keyboard.press('V');
  // await page.keyboard.up('Control');


  // const page = await browser.newPage();
  // await page.goto('https://google.com');

  // You can now interact with the new page as needed

  // await browser.close();
})();

// const myTargets =