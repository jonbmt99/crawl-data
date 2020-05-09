import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
const url = require('url');
const sanitizeHtml = require('sanitize-html');
export class NhanhCrawler extends ACrawler {
    async crawlFromArticle(articleUrl) {
        console.log('Crawl Article: ', articleUrl);
        const $ = await this.loadCheerioDoc(articleUrl);
        const title = $('.manual-title h1').text();
        let body = $('.manual-content').html();
        body = sanitizeHtml(body, {
            allowedAttributes: {}
        });
        return new Article(title, articleUrl, body, 'Nhanh');
    }
    async crawlFromCategory(catUrl) {
        const $ = await this.loadCheerioDoc(catUrl);
        const title = $('div.manual-title h1').text();
        const category = new Category(title, catUrl);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmhhbmhDcmF3bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvTmhhbmhDcmF3bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN0QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFM0IsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTlDLE1BQU0sT0FBTyxZQUFhLFNBQVEsUUFBUTtJQUNqQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBa0I7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDeEIsaUJBQWlCLEVBQUUsRUFDbEI7U0FDRixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBYztRQUMzQyxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTdDLGdEQUFnRDtRQUNoRCx3Q0FBd0M7UUFDeEMsOERBQThEO1FBQzlELE9BQU87UUFDUCxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxLQUFLLENBQUMsdUJBQXVCLENBQUMsTUFBYztRQUNsRCxNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQTtRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQVUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sZUFBZSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELE1BQU0sWUFBWSxHQUFHLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0RixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztZQUNwQyxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUVGIn0=