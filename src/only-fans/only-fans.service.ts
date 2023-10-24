import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scrapper } from '../scrapper/entities/scrapper.entity';
import { Status } from '../scrapper/enums/scrapper.enum';

@Injectable()
export class OnlyFansService {
  constructor(
    @InjectRepository(Scrapper) private readonly scrappersRepository: Repository<Scrapper>,
  ){}
  // private browserInstances: Map<string, puppeteer.Browser> = new Map();
  private browserInstances: Map<string, any> = new Map();
  private maxTimeout = 2*60*1000;
  private delayTimeout = 5000;
  private typeTimeoutDelay = 500; // 1100

  async createBrowserInstance(id: string) {
    const browser = await puppeteer.launch({
      headless: false
    });
    // const browser = await puppeteer.launch({
    //   // devtools: true,
    //   // args: [
    //   //   '--disable-web-security',
    //   //   '--disable-features=IsolateOrigins',
    //   //   '--disable-site-isolation-trials',
    //   //   '--disable-features=BlockInsecurePrivateNetworkRequests',
    //   //   // '--no-sandbox',
    //   //   '--disable-setuid-sandbox'
    //   // ],
    //   headless: false
    // });

    this.browserInstances.set(id, browser);
  }

  async closeBrowserInstance(id: string) {
    const browser = this.browserInstances.get(id);

    if (browser) {
      const scrapper = await this.scrappersRepository.findOneBy({
        id: +id,
      })
      scrapper.status = Status.Offline;
      await this.scrappersRepository.save(scrapper);

      await browser.close();
      this.browserInstances.delete(id);
    }
  }

  async getProducts(products: string) {
    // const browser = await puppeteer.connect({
    //   // browserWSEndpoint: this.configService.getOrThrow('SBR_WS_ENDPOINT')
    //   // browserWSEndpoint: 'ws://localhost:3000'
    //   browserURL: 'http://localhost:9222'
    // });
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await Promise.all([
        page.waitForNavigation(),
        page.goto('https://amazon.com')
      ])
      await page.type('#twotabsearchtextbox', products)
      await Promise.all([
        page.waitForNavigation(),
        page.click('#nav-search-submit-button')
      ])
      return await page.$$eval('.s-search-results .s-card-container',
        (resultItems) => {
        return resultItems.map(resultItem => {
          const url = resultItem.querySelector('a').href;
          const title = resultItem.querySelector(
            '.s-title-instructions-style span',
          )?.textContent;
          const price = resultItem.querySelector(
            '.a-price .a-offscreen',
          ).textContent;
          return {url, title, price};
        })
      });
    } finally {
      await browser.close();
    }
  }

  async getDataViaPuppeteer() {

    const URL = 'https://example.com';

    // createIncognitoBrowserContext
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    await page.goto(URL, {
        waitUntil: 'networkidle2'
    });

    console.log('testing inside NEST console')

    const results = await page.evaluate(() => {
      const propertyList = [];
      console.log('testing inside HEADLESS BROWSER console')

      document.querySelectorAll('.List').forEach((item) => {
        let someList = []

        item.querySelectorAll('.subList').forEach((sublistItem) => {
          if (sublistItem.querySelector('img').src) {
            // do something
            // item.querySelector('.detail-property > div > h2')?.textContent
          }
        })
        propertyList.push('someData');
      })

      return propertyList;
    })

    // await browser.close()
    // return 'someData';
  }


  async stopAllScrappers() {
    const scrappers = await this.scrappersRepository.find();

    try {
      await Promise.all(scrappers.map(async (scrapper) => {
        if (scrapper.status === Status.Online && this.browserInstances.has(scrapper.id.toString())) {
          await this.closeBrowserInstance(scrapper.id.toString());
        }
      }));
    } catch (err) {
      throw new HttpException(err, HttpStatus.CONFLICT);
    }
    return 'success';
  }

  async stopScrapper(id: string) {
    if (this.browserInstances.has(id)) {
      await this.closeBrowserInstance(id)
      return 'success'
    } else {
      throw new HttpException('Scrapper not running', HttpStatus.CONFLICT);
    }
  }

  async runScrapper(id: string) {
    const scrapper = await this.scrappersRepository.findOneBy({
      id: +id,
    })

    if (!scrapper) {
      throw new NotFoundException('Scrapper not found');
    }
    if (scrapper.status === Status.Online) {
      throw new HttpException('Scrapper already running', HttpStatus.CONFLICT);
    }

    if (!this.browserInstances.has(id)) {
      await this.createBrowserInstance(id);
    }

    scrapper.status = Status.Online;
    await this.scrappersRepository.save(scrapper);
    
    const URL = 'https://onlyfans.com/'

    const browser = this.browserInstances.get(id);
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', async interceptedRequest => {
      if (interceptedRequest.isNavigationRequest() && interceptedRequest.redirectChain().length === 0) {
        await interceptedRequest.continue();
      } else {
        await interceptedRequest.continue();
      }
    });

    page.on('response', async response => {
      console.log('!!! Intercept response scrapper');
      // console.log("response code: ", response.status());

      const request = await response.request();

      const URL = request.url();
      const isMedia = URL.endsWith('.jpg') || URL.endsWith('.png')
      const isRecapcha = URL.includes('https://recaptcha.net')

      if (response.status() === 200 && response.headers()['content-length'] !== '0' && !isMedia && !isRecapcha) {
        console.log('Inside');
        console.log(request.url());
        // console.log(response.request());
        // console.log(request.headers());
        // console.log(response.request().method());
        const contentType = response.headers()['content-type'];
        const isImage = contentType && contentType.includes('image')

        if (!isImage) {
          if (contentType && contentType.includes('application/json')) {
            // console.log('JSON Response:');
            // console.log(response);
            console.log('contentType: application/json');
            // https://onlyfans.com/api2/v2/users/list?a[]=15585607&a[]=108013309&a[]=234122322
            const jsonResponse = await response.json();
            console.log('JSON Response:', jsonResponse);
          }

          // text/javascript text/html text/plain
          if (contentType && contentType.includes('text/plain')) {
            console.log('contentType: text/plain');
            const textResponse = await response.text();
            console.log('Text Response:', textResponse);
          }
        }
      }
    });

    try {
      page.setDefaultNavigationTimeout(1 * 60 * 1000);
      page.goto(URL, {timeout: 30000})

      await page.waitForSelector('[type="email"]');
      await page.waitForSelector('[type="password"]');

      await this.slowType(page, '[type="email"]', scrapper.email);
      await this.slowType(page, '[type="password"]', scrapper.password);

      await page.waitForSelector('[type="submit"]');
      page.click('[type="submit"]')

      await page.waitForSelector('[data-name="Chats"]', { visible: true, timeout: this.maxTimeout });
      await this.delay(this.delayTimeout);
      page.click('[data-name="Chats"]')

      await page.waitForSelector('[data-name="Collections"]', { visible: true, timeout: this.maxTimeout });
      await this.delay(this.delayTimeout);
      page.click('[data-name="Collections"]')

    } catch (error) {
      await this.closeBrowserInstance(id);
      console.error('Navigation failed:', error);
      throw new HttpException('Gateway timeout', HttpStatus.GATEWAY_TIMEOUT);
    }

    return id;
  }

  async slowType(page, selector, text) {
    await page.waitForSelector(selector);

    const inputElement = await page.$(selector);

    for (const char of text) {
      await inputElement.type(char, { delay: this.typeTimeoutDelay });
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
