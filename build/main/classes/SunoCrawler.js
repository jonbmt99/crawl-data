"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = require("../types/Article");
const Category_1 = require("../types/Category");
const ACrawler_1 = require("./ACrawler");
const url = require('url');
const sanitizeHtml = require('sanitize-html');
class SunoCrawler extends ACrawler_1.ACrawler {
    async crawlFromArticle(articleUrl) {
        if (articleUrl.includes('hotro.suno.vn')) {
            // console.log('Crawl Article: ', articleUrl);
            const $ = await this.loadCheerioDoc(articleUrl);
            const title = $('#page-header h1.page-title').text();
            let body = $('.entry-content').html();
            body = sanitizeHtml(body, {
                allowedAttributes: {}
            });
            return new Article_1.Article(title, articleUrl, body, 'Suno');
        }
        else {
            const $ = await this.loadCheerioDoc(articleUrl);
            const title = $('h1.entry-title').text();
            let body = $('.entry-content').html();
            body = sanitizeHtml(body, {
                allowedAttributes: {}
            });
            return new Article_1.Article(title, articleUrl, body, 'Suno');
        }
    }
    async crawlFromCategory(catUrl) {
        if (catUrl.includes('hotro.suno.vn')) {
            const $ = await this.loadCheerioDoc(catUrl);
            // console.log($.html());
            const title = $('#page-header .page-title span').text();
            const category = new Category_1.Category(title, catUrl);
            const nextPage$ = $('.next.page-numbers');
            if (nextPage$.contents().length) {
                category.nextPageUrl = nextPage$.first().attr('href');
            }
            category.articles = await this.crawActicleFromCategory(catUrl);
            return category;
        }
        else {
            const $ = await this.loadCheerioDoc(catUrl);
            const title = $('.section-title-main').text();
            const category = new Category_1.Category(title, catUrl);
            category.articles = await this.crawActicleFromCategory(catUrl);
            return category;
        }
    }
    async crawActicleFromCategory(catUrl) {
        if (catUrl.includes('hotro.suno.vn')) {
            console.log('==================================');
            console.log('Crawl Category', catUrl);
            console.log('==================================');
            const $ = await this.loadCheerioDoc(catUrl);
            const blogArr = $('h2.entry-title').toArray();
            // console.log('BLOG ARR', blogArr.length);
            const blogs = Promise.all(blogArr.map(async (blog$) => {
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
        else {
            const $ = await this.loadCheerioDoc(catUrl);
            const blogArr = $('.post-item .col-inner').toArray();
            console.log('BLOG ARR', blogArr.length);
            const blogs = Promise.all(blogArr.map(async (blog$) => {
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
exports.SunoCrawler = SunoCrawler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vub0NyYXdsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xhc3Nlcy9TdW5vQ3Jhd2xlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEyQztBQUMzQyxnREFBNkM7QUFDN0MseUNBQXNDO0FBQ3RDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUUzQixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFOUMsTUFBYSxXQUFZLFNBQVEsbUJBQVE7SUFDaEMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQWtCO1FBQzlDLElBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBQztZQUN0Qyw4Q0FBOEM7WUFDOUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFO2dCQUN4QixpQkFBaUIsRUFBRSxFQUNsQjthQUNGLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxF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