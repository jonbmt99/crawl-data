import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const url = require('url');

const sanitizeHtml = require('sanitize-html');

export class IChinaCrawler extends ACrawler {
  public async crawlFromArticle(articleUrl: string): Promise<Article> {
    console.log('Crawl Article: ', articleUrl);
    const $ = await this.loadCheerioDoc(articleUrl);
    const title = $('.swiper-title.multi-banner-title').text();
    let body = $('.section-content').html();
    body = sanitizeHtml(body, {
      allowedAttributes: {
      }
    });
    return new Article(title, articleUrl, body, 'IChina');
  }

  public async crawlFromCategory(catUrl: string): Promise<Category> {
    const $ = await this.loadCheerioDoc(catUrl);
    const title = $('.widget h2.spankd').html();
    const category = new Category(title, catUrl);

    // const nextPage$ = $('.next.page-numbers');
    // if (nextPage$.contents().length) {
    //   category.nextPageUrl = nextPage$.first().attr('href');
    // }

    category.articles = await this.crawActicleFromCategory(catUrl);

    return category;
  }

  private async crawActicleFromCategory(catUrl: string): Promise<Article[]> {
    console.log('==================================');
    console.log('Crawl Category', catUrl);
    console.log('==================================');
    const $ = await this.loadCheerioDoc(catUrl);
    const blogArr = $('.post-list__item-content').toArray();
    console.log('BLOG ARR', blogArr.length);
    return Promise.all<Article>(blogArr.map(async (blog$) => {
      let blogLink = $(blog$).find('a').first().attr('href');
      blogLink = url.resolve(catUrl, blogLink);
      const backgroundImage = $(blog$).find('img').attr('src');
      const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
      const article = await this.crawlFromArticle(blogLink);
      article.featureImage = featureImage;
      return article;
    }));
  }

}
