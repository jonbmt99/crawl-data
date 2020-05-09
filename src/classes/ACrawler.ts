import axios from 'axios';
import { Article } from '../types/Article';
import { Category } from '../types/Category';
const cheerio = require('cheerio');

export abstract class ACrawler {
  public loadHtmlFromUrl(url: string) {
    return axios.get(url).then(res => res.data).catch(e => console.log(e));
  }

  public async loadCheerioDoc(url: string) {
    const html = await this.loadHtmlFromUrl(url);
    return cheerio.load(html, {
      decodeEntities: false
    });
  }
  public abstract crawlFromCategory(catUrl: string): Promise<Category>;
  public abstract crawlFromArticle(articleUrl: string): Promise<Article>;
}
