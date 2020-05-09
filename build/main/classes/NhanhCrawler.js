"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = require("../types/Article");
const Category_1 = require("../types/Category");
const ACrawler_1 = require("./ACrawler");
const url = require('url');
const sanitizeHtml = require('sanitize-html');
class NhanhCrawler extends ACrawler_1.ACrawler {
    async crawlFromArticle(articleUrl) {
        console.log('Crawl Article: ', articleUrl);
        const $ = await this.loadCheerioDoc(articleUrl);
        const title = $('.manual-title h1').text();
        let body = $('.manual-content').html();
        body = sanitizeHtml(body, {
            allowedAttributes: {}
        });
        return new Article_1.Article(title, articleUrl, body, 'Nhanh');
    }
    async crawlFromCategory(catUrl) {
        const $ = await this.loadCheerioDoc(catUrl);
        const title = $('div.manual-title h1').text();
        const category = new Category_1.Category(title, catUrl);
        // // const nextPage$ = $('.next.page-numbers');
        // // if (nextPage$.contents().length) {
        // //   category.nextPageUrl = nextPage$.first().attr('href');
        // // }
        category.articles = await this.crawActicleFromCategory(catUrl);
        return category;
    }
    async crawActicleFromCategory(catUrl) {
        const domain = 'https://nhanh.vn';
        console.log('==================================');
        console.log('Crawl Category', catUrl);
        console.log('==================================');
        const $ = await this.loadCheerioDoc(catUrl);
        const blogArr = $('.jstree-children li.jstree-node').toArray();
        console.log('BLOG ARR', blogArr.length);
        return Promise.all(blogArr.map(async (blog$) => {
            let blogLink = $(blog$).find('a').first().attr('href');
            blogLink = url.resolve(domain, blogLink);
            const backgroundImage = $(blog$).find('img').attr('src');
            const featureImage = (backgroundImage || '').replace('url(\'', '').replace('\')', '');
            const article = await this.crawlFromArticle(blogLink);
            article.featureImage = featureImage;
            return article;
        }));
    }
}
exports.NhanhCrawler = NhanhCrawler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmhhbmhDcmF3bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvTmhhbmhDcmF3bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOENBQTJDO0FBQzNDLGdEQUE2QztBQUM3Qyx5Q0FBc0M7QUFDdEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRTNCLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxNQUFhLFlBQWEsU0FBUSxtQkFBUTtJQUNqQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBa0I7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDeEIsaUJBQWlCLEVBQUUsRUFDbEI7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksaUJBQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQWM7UUFDM0MsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFN0MsZ0RBQWdEO1FBQ2hELHdDQUF3QztRQUN4Qyw4REFBOEQ7UUFDOUQsT0FBTztRQUNQLFFBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVPLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxNQUFjO1FBQ2xELE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFBO1FBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBVSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN0RCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RCxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDekMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1lBQ3BDLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0NBRUY7QUE3Q0Qsb0NBNkNDIn0=