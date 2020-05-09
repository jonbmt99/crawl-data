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
    async crawlFromArticle(articleUrl) {
        console.log('Crawl Article: ', articleUrl);
        const $ = await this.loadCheerioDoc(articleUrl);
        const title = $('h2.supportMain-content_article-title').text();
        let body = $('.supportMain-content_article-wrapper').html();
        $('.fb-comments').remove();
        body = sanitizeHtml(body, {
            allowedAttributes: {}
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
    async crawlFromCategory(catUrl) {
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
    async crawActicleFromCategory(catUrl) {
        console.log('==================================');
        console.log('Crawl Category', catUrl);
        console.log('==================================');
        const $ = await this.loadCheerioDoc(catUrl);
        const blogArr = $('li.menu-item').toArray();
        let blogs = await Promise.all(blogArr.map(async (blog$) => {
            const blogLink = $(blog$).find('a').first().attr('href');
            const backgroundImage = $(blog$).find('a').first().css('background-image');
            const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
            if (blogLink == undefined)
                return false;
            const article = await this.crawlFromArticle(blogLink);
            article.featureImage = featureImage;
            return article;
        }));
        return blogs;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2lvdFZpZXRDcmF3bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvS2lvdFZpZXRDcmF3bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN0QyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFOUMsTUFBTSxPQUFPLGVBQWdCLFNBQVEsUUFBUTtJQUMzQyx3RUFBd0U7SUFDeEUsZ0RBQWdEO0lBQ2hELHFEQUFxRDtJQUNyRCw2Q0FBNkM7SUFDN0Msb0RBQW9EO0lBQ3BELHlEQUF5RDtJQUN6RCxnQ0FBZ0M7SUFDaEMsMkJBQTJCO0lBQzNCLFFBQVE7SUFDUixRQUFRO0lBQ1IsNkRBQTZEO0lBQzdELElBQUk7SUFDRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBa0I7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsTUFBTSxLQUFLLEdBQUUsQ0FBQyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUQsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNCLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFO1lBQ3hCLGlCQUFpQixFQUFFLEVBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLE9BQU8s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