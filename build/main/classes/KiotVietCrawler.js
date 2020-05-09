"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = require("../types/Article");
const Category_1 = require("../types/Category");
const ACrawler_1 = require("./ACrawler");
const sanitizeHtml = require('sanitize-html');
class KiotVietCrawler extends ACrawler_1.ACrawler {
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
        return new Article_1.Article(title, articleUrl, body, 'KiotViet');
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
        const category = new Category_1.Category(title, catUrl);
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
exports.KiotVietCrawler = KiotVietCrawler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2lvdFZpZXRDcmF3bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvS2lvdFZpZXRDcmF3bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOENBQTJDO0FBQzNDLGdEQUE2QztBQUM3Qyx5Q0FBc0M7QUFDdEMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTlDLE1BQWEsZUFBZ0IsU0FBUSxtQkFBUTtJQUMzQyx3RUFBd0U7SUFDeEUsZ0RBQWdEO0lBQ2hELHFEQUFxRDtJQUNyRCw2Q0FBNkM7SUFDN0Msb0RBQW9EO0lBQ3BELHlEQUF5RDtJQUN6RCxnQ0FBZ0M7SUFDaEMsMkJBQTJCO0lBQzNCLFFBQVE7SUFDUixRQUFRO0lBQ1IsNkRBQTZEO0lBQzdELElBQUk7SUFDRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBa0I7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsTUFBTSxLQUFLLEdBQUUsQ0FBQyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUQsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzNCLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFO1lBQ3hCLGlCQUFpQixFQUFFLEVBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLGlCQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELHNFQUFzRTtJQUN0RSxpREFBaUQ7SUFD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