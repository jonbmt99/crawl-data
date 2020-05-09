import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const sanitizeHtml = require('sanitize-html');

export class KiotVietCrawler extends ACrawler {
  // public async crawlFromArticle(articleUrl: string): Promise<Article> {
  //   console.log('Crawl Article: ', articleUrl);
  //   const $ = await this.loadCheerioDoc(articleUrl);
  //   const container$ = $('.left-container');
  //   const title = container$.find('.title').text();
  //   let body = container$.find('.content-write').html();
  //   body = sanitizeHtml(body, {
  //     allowedAttributes: {
  //     }
  //   });
  //   return new Article(title, articleUrl, body, 'KiotViet');
  // }
  public async crawlFromArticle(articleUrl: string): Promise<Article> {
    console.log('Crawl Article: ', articleUrl);
    const $ = await this.loadCheerioDoc(articleUrl);
 
    const title =$('h2.supportMain-content_article-title').text();
    let body = $('.supportMain-content_article-wrapper').html();
    $('.fb-comments').remove();
    body = sanitizeHtml(body, {
      allowedAttributes: {
      }
    });
    return new Article(title, articleUrl, body, 'KiotViet');
  }

  // public async crawlFromCategory(catUrl: string): Promise<Category> {
  //   const $ = await this.loadCheerioDoc(catUrl);
  //   const title = $($('.breadcrumb').contents().toArray().pop()).html();
  //   const category = new Category(title, catUrl);
  //   const nextPage$ = $('.next.page-numbers');
  //   if (nextPage$.contents().length) {
  //     category.nextPageUrl = nextPage$.first().attr('href');
  //   }
  //   category.articles = await this.crawActicleFromCategory(catUrl);
  //   return category;
  // }
  public async crawlFromCategory(catUrl: string): Promise<Category> {
    const $ = await this.loadCheerioDoc(catUrl);
    const title = $('.supportMain-content_article-title').text();
    const category = new Category(title, catUrl);
    // const nextPage$ = $('.next.page-numbers');
    // if (nextPage$.contents().length) {
    //   category.nextPageUrl = nextPage$.first().attr('href');
    // }
    category.articles = await this.crawActicleFromCategory(catUrl);
    return category;
  }


  // private async crawActicleFromCategory(catUrl: string): Promise<Article[]> {
  //   console.log('==================================');
  //   console.log('Crawl Category', catUrl);
  //   console.log('==================================');
  //   const $ = await this.loadCheerioDoc(catUrl);
  //   const blogArr = $('.blogs-list').contents().toArray();
  //   let blogs = await Promise.all<Article>(blogArr.map(async (blog$) => {
  //     const blogLink = $(blog$).find('a').first().attr('href');
  //     if(blogLink == 'https://www.kiotviet.vn/cong-thuc-tang-doanh-so-cho-nganh-dien-may-trong-mua-he/') {
  //       return false ;
  //     }
  //     const backgroundImage = $(blog$).find('a').first().css('background-image');
  //     const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
  //     const article = await this.crawlFromArticle(blogLink);
  //     article.featureImage = featureImage;
  //     return article;
  //   }));
  //   return blogs;
  // }
  private async crawActicleFromCategory(catUrl: string): Promise<Article[]> {
    console.log('==================================');
    console.log('Crawl Category', catUrl);
    console.log('==================================');
    const $ = await this.loadCheerioDoc(catUrl);
    const blogArr = $('li.menu-item').toArray();
    let blogs = await Promise.all<Article>(blogArr.map(async (blog$) => {
      const blogLink = $(blog$).find('a').first().attr('href');
      const backgroundImage = $(blog$).find('a').first().css('background-image');
      const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
      if(blogLink == undefined) return false ;
      const article = await this.crawlFromArticle(blogLink);
      article.featureImage = featureImage;
      return article;
    }));
    return blogs;
  }
}
