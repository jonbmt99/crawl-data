import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const url = require('url');

const sanitizeHtml = require('sanitize-html');

export class SunoCrawler extends ACrawler {
  public async crawlFromArticle(articleUrl: string): Promise<Article> {
    if(articleUrl.includes('hotro.suno.vn')){
      // console.log('Crawl Article: ', articleUrl);
      const $ = await this.loadCheerioDoc(articleUrl);
      const title = $('#page-header h1.page-title').text();
      let body = $('.entry-content').html();
      body = sanitizeHtml(body, {
        allowedAttributes: {
        }
      });
      return new Article(title, articleUrl, body, 'Suno');
    } else {
      const $ = await this.loadCheerioDoc(articleUrl);
      const title = $('h1.entry-title').text();
      let body = $('.entry-content').html();
      body = sanitizeHtml(body, {
        allowedAttributes: {
        }
      });
      return new Article(title, articleUrl, body, 'Suno');
    }

  }

  public async crawlFromCategory(catUrl: string): Promise<Category> {
    if(catUrl.includes('hotro.suno.vn')){
      const $ = await this.loadCheerioDoc(catUrl);
      // console.log($.html());
      const title = $('#page-header .page-title span').text();
      const category = new Category(title, catUrl);
      const nextPage$ = $('.next.page-numbers');
      if (nextPage$.contents().length) {
        category.nextPageUrl = nextPage$.first().attr('href');
      }
      category.articles = await this.crawActicleFromCategory(catUrl);
      return category;
    } else {
      const $ = await this.loadCheerioDoc(catUrl);
      const title = $('.section-title-main').text();
      const category = new Category(title, catUrl);
      category.articles = await this.crawActicleFromCategory(catUrl);
      return category;
    }

  }

  private async crawActicleFromCategory(catUrl: string): Promise<Article[]> {
    if(catUrl.includes('hotro.suno.vn')){
        console.log('==================================');
        console.log('Crawl Category', catUrl);
        console.log('==================================');
        const $ = await this.loadCheerioDoc(catUrl);
        const blogArr = $('h2.entry-title').toArray();
        
      // console.log('BLOG ARR', blogArr.length);
      const blogs =  Promise.all<Article>(blogArr.map(async (blog$) => {
        let blogLink = $(blog$).find('a').first().attr('href');
        blogLink = url.resolve(catUrl, blogLink);
        const backgroundImage = $(blog$).find('img').attr('src');
        const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
        const article = await this.crawlFromArticle(blogLink);
        article.featureImage = featureImage;
        return article;
      }));
      return blogs;
    } else {
      const $ = await this.loadCheerioDoc(catUrl);
      const blogArr = $('.post-item .col-inner').toArray();
       console.log('BLOG ARR', blogArr.length);
      const blogs =  Promise.all<Article>(blogArr.map(async (blog$) => {
        let blogLink = $(blog$).find('a').first().attr('href');
        blogLink = url.resolve(catUrl, blogLink);
        const backgroundImage = $(blog$).find('img').attr('src');
        const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
        const article = await this.crawlFromArticle(blogLink);
        article.featureImage = featureImage;
        return article;
      }));
      return blogs;
    }
  }
}
