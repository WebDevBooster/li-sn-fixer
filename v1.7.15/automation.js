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

function getRandomDelay(min = 1555, max = 3555) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


async function autoScrollSearchResults(page, scrollableSectionSelector) {
  // Must set viewport because otherwise things get messed up in this case
  const viewport = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  });
  await page.setViewport(viewport);
  await page.waitForSelector(scrollableSectionSelector);

  const scrollIncrement = await page.$eval(scrollableSectionSelector, el => el.clientHeight);
  const maxScrollHeight = await page.$eval(scrollableSectionSelector, el => el.scrollHeight - el.clientHeight);

  let currentScrollHeight = 0;
  while (currentScrollHeight < maxScrollHeight) {
    const newScrollHeight = Math.min(currentScrollHeight + scrollIncrement, maxScrollHeight);
    await page.evaluate(`document.querySelector("${scrollableSectionSelector}").scrollTo(0, ${newScrollHeight})`);
    await page.waitForTimeout(getRandomDelay());
    currentScrollHeight = newScrollHeight;
  }

  await page.evaluate(`document.querySelector("${scrollableSectionSelector}").scrollTo(0, 0)`);
}

/*
async function scrollDownABit(page, scrollableSectionSelector) {
  await page.waitForTimeout(getRandomDelay());
  const scrollIncrementPercentage = 0.95;
  const scrollIncrement = await page.evaluate((selector, percentage) => {
    const section = document.querySelector(selector);
    const sectionHeight = section.clientHeight;
    return Math.floor(sectionHeight * percentage);
  }, scrollableSectionSelector, scrollIncrementPercentage);

  await page.evaluate((selector, increment) => {
    const section = document.querySelector(selector);
    section.scrollBy(0, increment);
  }, scrollableSectionSelector, scrollIncrement);
}


async function hasScrolledToBottom(page, scrollableSectionSelector) {
  return await page.evaluate(selector => {
    const section = document.querySelector(selector);
    return section.scrollTop + 1 >= section.scrollHeight - section.offsetHeight;
  }, scrollableSectionSelector);
}
*/

(async () => {
  // Visit http://127.0.0.1:9222/json/version to get the current webSocketDebuggerUrl
  // Before visiting that URL, make sure Chrome was launched with the `--remote-debugging-port=9222` flag.
  // "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
  // Do NOT use `localhost` because it can resolve to different IP addresses, including ::1,
  // which is the IPv6 loopback address for the local machine.
  // This can result in "Failed to fetch browser webSocket URL" error.
  // Always use `127.0.0.1`, which is the IPv4 loopback address.
  const browserURL = 'ws://127.0.0.1:9222/devtools/browser/368ade59-a09f-4dfb-9a40-1f17d443d834';
  const browser = await puppeteer.connect({ browserWSEndpoint: browserURL, defaultViewport: null });

  const pages = await browser.pages();

  const searchUrlFragment = "https://www.linkedin.com/sales/search/people";
  const scrollableSearchLinksContainerSelector = '#search-results-container';
  const searchLinkSelector = '#search-results-container > div > ol > li > div > div > div.flex.justify-space-between.full-width > div.flex.flex-column > div.mb3 > div > div.artdeco-entity-lockup__content.ember-view > div.flex.flex-wrap.align-items-center > div.artdeco-entity-lockup__title.ember-view > a';
  const buttonSearchNextPageSelector = "#search-results-container button.artdeco-pagination__button--next";
  const leadUrlFragment = "https://www.linkedin.com/sales/lead";
  const sheetsUrlFragment = "https://docs.google.com/spreadsheets";
  const profileUrlFragment = "https://www.linkedin.com/in/";

  async function copyDataIntoSpreadsheet(pages) {
    let status = "OK";
    while (status === "OK") {
      const page = await findTabByTitleOrUrl(pages, leadUrlFragment);
      if (!page) {
        status = "can't find a lead page";
        break;
      }

      try {
        await activateTab(page);

        // Wait for the page to load and #SNF-doc-height to appear
        // await page.waitForNavigation({ waitUntil: 'networkidle0' });
        try {
          await page.waitForSelector('#SNF-doc-height', { timeout: 29000 });
        } catch (error) {
          console.log(`Waiting for selector #SNF-doc-height failed: ${error.message}`);
          console.log('Reloading the page...');
          await page.reload();
          await page.waitForTimeout(getRandomDelay(9999, 12222));

          // second try
          try {
            await page.waitForSelector('#SNF-doc-height', { timeout: 29000 });
          } catch (error) {
            console.log(`Waiting for selector #SNF-doc-height failed: ${error.message}`);
            console.log('Reloading the page...');
            await page.reload();
            await page.waitForTimeout(getRandomDelay(27777, 29999));

            status = "failed to get #SNF-doc-height in profile after second try";
            await sendTelegram(status);
            break;
          }
        }

        // Move the mouse to the menuTrigger element and click it
        const menuTrigger = await page.waitForSelector('#profile-card-section > section[class^=_header] > div[class^=_actions-container] > section[class^=_actions-bar] > button');
        await menuTrigger.hover();
        await page.waitForTimeout(getRandomDelay(999, 1222));
        await menuTrigger.click();

        // Wait for the menu item to appear and click it
        await page.waitForSelector('#hue-web-menu-outlet ul li a', { visible: true });
        // After the menu opens, there's a "#hue-web-menu-outlet ul li" element containing the text "Copy URL"
        const copyButton = await page.waitForXPath('//li/button/div/div[contains(.,"Copy")]');
        await page.waitForTimeout(getRandomDelay(999, 1222));
        await copyButton.hover();
        await page.waitForTimeout(getRandomDelay(555, 777));
        await copyButton.click();

        // Copy the text and verify the clipboard contents
        await page.waitForSelector('#SNF-copy');
        await page.waitForTimeout(getRandomDelay(999, 1222));
        await page.click('#SNF-copy');
        await page.waitForSelector('#SNFc-success');
        await page.waitForTimeout(getRandomDelay(999, 1222));
        const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
        await page.waitForTimeout(getRandomDelay(555, 777));

        if (clipboardContent.includes(profileUrlFragment)) {
          console.log('Clipboard content is correct');

          // bring Google Sheets tab to front
          const sheetsPage = await findTabByTitleOrUrl(pages, sheetsUrlFragment);
          if (!sheetsPage) {
            console.log('Google Sheets tab not found');
            await sendTelegram("Google Sheets tab not found.");
            break;
          }
          await activateTab(sheetsPage);

          // paste clipboard contents and move down one cell
          console.log('Pasting clipboard contents and moving down one cell');
          await sheetsPage.waitForTimeout(getRandomDelay(999, 1222));
          await sheetsPage.keyboard.down('Control');
          await sheetsPage.keyboard.press('KeyV');
          await sheetsPage.keyboard.up('Control');
          await sheetsPage.waitForTimeout(getRandomDelay(2222, 2555));
          await sheetsPage.keyboard.press('ArrowDown');
          await sheetsPage.waitForTimeout(getRandomDelay(999, 1222));

          // Close the last profile tab
          await page.close();

          // update the list of open tabs
          const updatedPages = await browser.pages();
          pages.length = 0;
          pages.push(...updatedPages);
        } else {
          console.log('Clipboard content is incorrect');
          status = "Incorrect clipboard content. Need intervention!";
          await sendTelegram(status);
          break;
        }
      } catch (error) {
        console.log(`An error occurred: ${error.message}`);
        // Ignore the error and move on to the next iteration of the while loop
      }
    }

    status = "current profile batch finished";
    // await sendTelegram(status);
    console.log(status);
  }

/*
  ////////////////////////////////////////////////

/!*
  async function clickVisibleLinks(page, selector) {
    await page.waitForSelector(selector);

    const links = await page.evaluate(selector => {
      const visibleLinks = [];
      const elements = Array.from(document.querySelectorAll(selector));
      for (const el of elements) {
        const { top, bottom } = el.getBoundingClientRect();
        if (top >= 0 && bottom <= window.innerHeight) {
          visibleLinks.push({ href: el.href, element: el });
        }
      }
      return visibleLinks;
    }, selector);
    console.log("links: ", links);

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const element = await link.evaluateHandle(link => link);
      await element.click({ button: 'middle' });
      await page.waitForTimeout(getRandomDelay());
    }

    // await autoScrollSearchResults(page, scrollableSectionSelector, window.innerHeight / 2);
    // await page.waitForTimeout(2000);

  }
*!/

/!*
 // The "almost" working version:
  async function clickVisibleLinks(page, selector) {
    await page.waitForSelector(selector);

    const links = await page.$$(selector);
    console.log("Number of links found:", links.length);

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const isVisible = await link.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;
        const isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
      });
      if (isVisible) {
        console.log("Link index:", i, "Link href:", await link.evaluate(link => link.href));
        await link.click({ button: 'middle' });
        console.log("Link clicked:", i);
        await page.waitForTimeout(getRandomDelay());
      }
    }
  }
*!/

/!*
  async function autoScrollDown(page, scrollableSectionSelector, scrollIncrement) {
    await page.waitForSelector(scrollableSectionSelector);

    const maxScrollHeight = await page.evaluate(selector => {
      const scrollableSection = document.querySelector(selector);
      return scrollableSection.scrollHeight - scrollableSection.clientHeight;
    }, scrollableSectionSelector);

    let currentScrollHeight = 0;
    while (currentScrollHeight < maxScrollHeight) {
      const newScrollHeight = Math.min(currentScrollHeight + scrollIncrement, maxScrollHeight);
      await page.evaluate(`document.querySelector("${scrollableSectionSelector}").scrollTo(0, ${newScrollHeight})`);
      await page.waitForTimeout(getRandomDelay());
      currentScrollHeight = newScrollHeight;
    }
  }
*!/

/!*
  /!**
   * Scrolls down by the given increment without ever scrolling back up.
   * @param {Object} page - The Puppeteer page object.
   * @param {string} scrollableSectionSelector - The CSS selector for the scrollable section.
   * @param {number} scrollIncrement - The number of pixels to scroll down by.
   *!/
  async function autoScrollDown(page, scrollableSectionSelector, scrollIncrement) {
    // Wait for the scrollable section to appear
    await page.waitForSelector(scrollableSectionSelector);

    // Calculate the maximum scroll height
    const maxScrollHeight = await page.evaluate(selector => {
      const scrollableSection = document.querySelector(selector);
      return scrollableSection.scrollHeight - scrollableSection.clientHeight;
    }, scrollableSectionSelector);

    // Scroll down by the given increment until the maximum scroll height is reached
    let currentScrollHeight = 0;
    while (currentScrollHeight < maxScrollHeight) {
      // Calculate the new scroll height
      const newScrollHeight = Math.min(currentScrollHeight + scrollIncrement, maxScrollHeight);
      // Scroll to the new scroll height
      await page.evaluate(`document.querySelector("${scrollableSectionSelector}").scrollTo(0, ${newScrollHeight})`);
      // Wait for a short amount of time before scrolling again
      await page.waitForTimeout(getRandomDelay());
      // Update the current scroll height
      currentScrollHeight = newScrollHeight;
    }
  }

*!/

/!*
  async function clickVisibleLinks(page, selector) {
    await page.waitForSelector(selector);

    let links = await page.$$(selector);
    console.log("Number of links found:", links.length);

    while (links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const isVisible = await link.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const elemTop = rect.top;
          const elemBottom = rect.bottom;
          const isVisible = elemTop < window.innerHeight && elemBottom >= 0;
          return isVisible;
        });
        if (isVisible) {
          console.log("Link index:", i, "Link href:", await link.evaluate(link => link.href));
          await link.click({ button: 'middle' });
          console.log("Link clicked:", i);
          await page.waitForTimeout(getRandomDelay());
        }
      }

      // const viewportHeight = await page.viewport().height();
      const viewportHeight = await page.viewport().height;
      const linkHeight = await links[0].evaluate((el) => el.getBoundingClientRect().height);
      const totalLinksHeight = linkHeight * links.length;
      const scrollIncrement = Math.floor(viewportHeight / linkHeight) * linkHeight;

      await autoScrollDown(page, scrollableSectionSelector, scrollIncrement);
      await page.waitForTimeout(getRandomDelay());

      links = await page.$$(selector);
    }
  }
*!/

  ////////////////////////////////////////////////
*/

/*
  async function autoScrollDown(page, scrollableSectionSelector) {
    const waitTime = 5000;
    const scrollIncrementPercentage = 0.95;
    const scrollIncrement = await page.evaluate((selector, percentage) => {
      const section = document.querySelector(selector);
      const sectionHeight = section.clientHeight;
      return Math.floor(sectionHeight * percentage);
    }, scrollableSectionSelector, scrollIncrementPercentage);

    let prevScrollHeight = 0;
    let scrollHeight = await page.evaluate(selector => {
      const section = document.querySelector(selector);
      return section.scrollHeight;
    }, scrollableSectionSelector);

    let totalScrolled = 0;
    let numScrolls = 0;

    await page.waitForTimeout(waitTime);

    while (totalScrolled < scrollHeight) {
      await page.evaluate((selector, increment) => {
        const section = document.querySelector(selector);
        section.scrollBy(0, increment);
      }, scrollableSectionSelector, scrollIncrement);

      numScrolls++;
      totalScrolled += scrollIncrement;

      console.log(`Scrolled ${scrollIncrement} pixels (${numScrolls} scrolls). Total scrolled: ${totalScrolled} pixels.`);

      await page.waitForTimeout(waitTime);

      prevScrollHeight = scrollHeight;
      scrollHeight = await page.evaluate(selector => {
        const section = document.querySelector(selector);
        return section.scrollHeight;
      }, scrollableSectionSelector);

      if (scrollHeight > prevScrollHeight) {
        console.log(`Updated scrollHeight: ${scrollHeight}`);
      }
    }

    console.log('Scrolling finished.');
  }
*/


  async function collectUserData(pages) {
    let status = "collectUserData() started.";
    await sendTelegram(status);

    const numOfSearchPagesToDo = 8; // 8 x 25 results per page (usually) ~ 200 profiles total
    let numOfSearchPagesDone = 0;

    while (numOfSearchPagesDone < numOfSearchPagesToDo) {
      // do work
      const searchPage = await findTabByTitleOrUrl(pages, searchUrlFragment);
      await activateTab(searchPage);

      // scroll the new search results page down and up to load all links
      await autoScrollSearchResults(searchPage, scrollableSearchLinksContainerSelector);

      const links = await searchPage.$$(searchLinkSelector);
      await searchPage.waitForTimeout(getRandomDelay(3333, 4444));

      // hover and click each link
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        // hover automatically scrolls a link into view
        await link.hover();
        await searchPage.waitForTimeout(getRandomDelay());
        await link.click({ button: 'middle' });
        console.log(`Clicked link ${i + 1}`);
      }

      // update the list of open tabs
      const updatedPages = await browser.pages();
      pages.length = 0;
      pages.push(...updatedPages);
      // handle the opened tabs
      await copyDataIntoSpreadsheet(pages);

      numOfSearchPagesDone++;

      await activateTab(searchPage);
      if (numOfSearchPagesDone !== numOfSearchPagesToDo) {
        // hover & click buttonSearchNextPage
        const buttonSearchNextPage = await searchPage.$(buttonSearchNextPageSelector);
        await buttonSearchNextPage.hover();
        await searchPage.waitForTimeout(getRandomDelay(555, 1111));
        console.log("hovered over the next page button");
        await buttonSearchNextPage.click();
        console.log("clicked the next page button")
        await searchPage.waitForTimeout(getRandomDelay(33333, 44444));
      }
    }

    status = "all finished!";
    console.log(status);
    await sendTelegram(status);

    console.log("disconnecting browser...");
    await browser.disconnect();
  }

  await collectUserData(pages);



  /*

    async function clickVisibleLinks(page, selector) {
      await page.waitForSelector(selector, { visible: true });

      const visibleElements = await page.evaluateHandle(selector => {
        const viewportHeight = window.innerHeight;
        return [...document.querySelectorAll(selector)]
            .filter(el => {
              const boundingBox = el.getBoundingClientRect();
              if (boundingBox) {
                const { top, bottom } = boundingBox;
                return top >= 0 && bottom <= viewportHeight;
              }
              return false;
            })
            .map(el => ({ href: el.href, element: el }));
      }, selector);

      const visibleElementsArray = await visibleElements.jsonValue();

      const linkClickPromises = visibleElementsArray.map(async el => {
        const elementToClick = await el.element;
        console.log("elementToClick: ", elementToClick);
        console.log(`el.href: ${el.href}`);
      });

      // Wait for all link clicks to complete
      await Promise.all(linkClickPromises);
    }

    await clickVisibleLinks(searchPage, selector);

  */


  /*

    while (true) {
      const links = await searchPage.$$(selector);
      console.log("links: ", links);

      if (links.length === 0) {
        console.log('No more links to click.');
        break;
      }

      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        await link.click({ button: 'middle' });
        await searchPage.waitForTimeout(getRandomDelay());
      }

      await autoScrollSearchResults(searchPage, scrollableSectionSelector, window.innerHeight / 2);
      await searchPage.waitForTimeout(2000);
    }

  */


  /*
  ///////////////////////////////////////////////
  // Click on all links matching the selector
    const selector = 'a:not(:visited)';
    const links = await page.$$(selector);
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      await link.click({ button: 'middle' });
      await page.waitForTimeout(getRandomDelay());
    }

  // Scroll to the bottom of the page again
    await autoScroll(page);

  // Scroll back to the top of the page again
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

  // Wait for a short delay
    await page.waitForTimeout(1000);

  // Click on all links matching the selector again
    const links2 = await page.$$(selector);
    for (let i = 0; i < links2.length; i++) {
      const link = links2[i];
      await link.click({ button: 'middle' });
      await page.waitForTimeout(getRandomDelay());
    }

  // Continue scrolling and clicking until all links have been clicked
    let previousHeight = await page.evaluate('document.body.scrollHeight');
    while (true) {
      await autoScroll(page);
      await page.waitForTimeout(1000);
      const newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight) {
        break;
      }
      previousHeight = newHeight;
      const links = await page.$$(selector);
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        await link.click({ button: 'middle' });
        await page.waitForTimeout(getRandomDelay());
      }
    }
  ////////////////////////////////
    */




})();
