"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = require("../types/Article");
const Category_1 = require("../types/Category");
const ACrawler_1 = require("./ACrawler");
const url = require('url');
const sanitizeHtml = require('sanitize-html');
class IChinaCrawler extends ACrawler_1.ACrawler {
    async crawlFromArticle(articleUrl) {
        console.log('Crawl Article: ', articleUrl);
        const $ = await this.loadCheerioDoc(articleUrl);
        const title = $('.swiper-title.multi-banner-title').text();
        let body = $('.section-content').html();
        body = sanitizeHtml(body, {
            allowedAttributes: {}
        });
        return new Article_1.Article(title, articleUrl, body, 'IChina');
    }
    async crawlFromCategory(catUrl) {
        const $ = await this.loadCheerioDoc(catUrl);
        const title = $('.widget h2.spankd').html();
        const category = new Category_1.Category(title, catUrl);
        // const nextPage$ = $('.next.page-numbers');
        // if (nextPage$.contents().length) {
        //   category.nextPageUrl = nextPage$.first().attr('href');
        // }
        category.articles = await this.crawActicleFromCategory(catUrl);
        return category;
    }
    async crawActicleFromCategory(catUrl) {
        console.log('==================================');
        console.log('Crawl Category', catUrl);
        console.log('==================================');
        const $ = await this.loadCheerioDoc(catUrl);
        const blogArr = $('.post-list__item-content').toArray();
        console.log('BLOG ARR', blogArr.length);
        return Promise.all(blogArr.map(async (blog$) => {
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
exports.IChinaCrawler = IChinaCrawler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSUNoaW5hQ3Jhd2xlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGFzc2VzL0lDaGluYUNyYXdsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBMkM7QUFDM0MsZ0RBQTZDO0FBQzdDLHlDQUFzQztBQUN0QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFM0IsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTlDLE1BQWEsYUFBYyxTQUFRLG1CQUFRO0lBQ2xDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFrQjtRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRTtZQUN4QixpQkFBaUIsRUFBRSxFQUNsQjtTQUNGLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBYztRQUMzQyxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU3Qyw2Q0FBNkM7UUFDN0MscUNBQXFDO1FBQ3JDLDJEQUEyRDtRQUMzRCxJQUFJO1FBRUosUUFBUSxDQUFDLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRU8sS0FBSyxDQUFDLHVCQUF1QixDQUFDLE1BQWM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFVLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3RELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZELFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN6QyxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RCxNQUFNLFlBQVksR0FBRyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEYsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsT0FBTyxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7WUFDcEMsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FFRjtBQTlDRCxzQ0E4Q0MifQ==