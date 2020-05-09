import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const url = require('url');
const sanitizeHtml = require('sanitize-html');
export class SunoCrawler extends ACrawler {
    async crawlFromArticle(articleUrl) {
        if (articleUrl.includes('hotro.suno.vn')) {
            // console.log('Crawl Article: ', articleUrl);
            const $ = await this.loadCheerioDoc(articleUrl);
            const title = $('#page-header h1.page-title').text();
            let body = $('.entry-content').html();
            body = sanitizeHtml(body, {
                allowedAttributes: {}
            });
            return new Article(title, articleUrl, body, 'Suno');
        }
        else {
            const $ = await this.loadCheerioDoc(articleUrl);
            const title = $('h1.entry-title').text();
            let body = $('.entry-content').html();
            body = sanitizeHtml(body, {
                allowedAttributes: {}
            });
            return new Article(title, articleUrl, body, 'Suno');
        }
    }
    async crawlFromCategory(catUrl) {
        if (catUrl.includes('hotro.suno.vn')) {
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
        }
        else {
            const $ = await this.loadCheerioDoc(catUrl);
            const title = $('.section-title-main').text();
            const category = new Category(title, catUrl);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vub0NyYXdsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xhc3Nlcy9TdW5vQ3Jhd2xlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDdEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRTNCLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxNQUFNLE9BQU8sV0FBWSxTQUFRLFFBQVE7SUFDaEMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQWtCO1FBQzlDLElBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBQztZQUN0Qyw4Q0FBOEM7WUFDOUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFO2dCQUN4QixpQkFBaUIsRUFBRSxFQUNsQjthQUNGLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDckQ7YUFBTTtZQUNMLE1BQU0sQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxNQUFNLEtBQUssR0FBRyxDQUFDLENB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