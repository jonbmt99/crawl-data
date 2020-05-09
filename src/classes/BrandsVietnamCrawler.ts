import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const sanitizeHtml = require('sanitize-html');

export class BrandsVietnamCrawler extends ACrawler{
  public async crawlFromArticle(articleUrl: string): Promise<Article> {
    const $ = await this.loadCheerioDoc(articleUrl);
    const title = $('h1').children().remove().end().text().trim();
    let body = $('#entry-content').html();
    body = sanitizeHtml(body, {
      allowedAttributes: {
      }
    }).replace(/\t|\n|  /g, '');
    return new Article(title, articleUrl, body, 'BrandsVietnam');
  }

  public async crawlFromCategory(catUrl: string): Promise<Category> {
    const $ = await this.loadCheerioDoc(catUrl);
    const title = $('ul.breadcrumb').siblings().text();
    const category = new Category(title, catUrl);

    category.nextPageUrl = $('.pagination .fa.fa-chevron-right').parent().attr('href');

    console.log('Category', category);

    category.articles = await this.crawArticleFromCategory(catUrl);

    return category;
  }

  private async crawArticleFromCategory(catUrl: string): Promise<Article[]> {
    const $ = await this.loadCheerioDoc(catUrl);
    const blogArr = $('.panel-body .row .col-sm-9 .row.m-b-sm').contents().toArray();
    let blogs = await Promise.all<Article>(blogArr.map(async $blog => {
      const blogLink = $($blog).find('.col-xs-3 a').attr('href');
      if (!blogLink) {
        return null;
      }
      const blogFeatureImage = $($blog).find('.col-xs-3 a img').attr('src');
      const article = await this.crawlFromArticle(blogLink);
      article.featureImage = blogFeatureImage;
      return article;
    }));
    blogs = blogs.filter(article => !!article);
    return blogs;
  }
}
