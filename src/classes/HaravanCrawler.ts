import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const URLToolkit = require('url-toolkit');
const sanitizeHtml = require('sanitize-html');

export class HaravanCrawler extends ACrawler{

  public static toAbsUrl(url) {
    return URLToolkit.buildAbsoluteURL('https://hocvien.haravan.com', url);
  }
  public async crawlFromArticle(articleUrl: string): Promise<Article> {
    console.log('Crawl Article: ', articleUrl);
    const $ = await this.loadCheerioDoc(articleUrl);
    const title = $('h1.hv-single-title').first().text();
    let  body = $('.hv-main-content').html();
    body = sanitizeHtml(body, {
      allowedAttributes: {
      }
    });
    body = body.trim();
    return new Article(title, articleUrl, body, 'Haravan');
  }

  public async  crawlFromCategory(catUrl: string): Promise<Category> {
    const $ = await this.loadCheerioDoc(catUrl);
    const title = $('h1.hv-category-heading > span').text();
    const category = new Category(title, catUrl);

    const nextPage$ = $('.next.page-node');
    if (nextPage$.contents().length) {
      category.nextPageUrl = HaravanCrawler.toAbsUrl(nextPage$.first().attr('href'));
    }

    console.log('Category', category);

    category.articles = await this.crawActicleFromCategory(catUrl);

    return category;
  }

  private async crawActicleFromCategory(catUrl: string): Promise<Article[]> {
    console.log('==================================');
    console.log('Crawl Category', catUrl);
    console.log('==================================');
    const $ = await this.loadCheerioDoc(catUrl);
    let blogArr = [];

    const sectionTop$ = $('.section-top');
    const tLink = HaravanCrawler.toAbsUrl(sectionTop$.find('a').first().attr('href'));
    const tImage = HaravanCrawler.toAbsUrl(sectionTop$.find('img').first().attr('src'));
    blogArr.push({
      image: tImage,
      link: tLink,
    });

    blogArr = blogArr.concat($('.section-list article').toArray().map(article => {
      const article$ = $(article);
      const link = HaravanCrawler.toAbsUrl(article$.find('a').first().attr('href'));
      const image = HaravanCrawler.toAbsUrl(article$.find('img').first().attr('src'));
      return {
        image,
        link,
      }
    }));

    const blogs = await Promise.all<Article>(blogArr.map(async (blog) => {
      const article = await this.crawlFromArticle(blog.link);
      article.featureImage = blog.image;
      return article;
    }));

    return blogs;
  }

}
