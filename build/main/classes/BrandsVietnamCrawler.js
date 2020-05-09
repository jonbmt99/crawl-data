"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article_1 = require("../types/Article");
const Category_1 = require("../types/Category");
const ACrawler_1 = require("./ACrawler");
const sanitizeHtml = require('sanitize-html');
class BrandsVietnamCrawler extends ACrawler_1.ACrawler {
    async crawlFromArticle(articleUrl) {
        const $ = await this.loadCheerioDoc(articleUrl);
        const title = $('h1').children().remove().end().text().trim();
        let body = $('#entry-content').html();
        body = sanitizeHtml(body, {
            allowedAttributes: {}
        }).replace(/\t|\n|  /g, '');
        return new Article_1.Article(title, articleUrl, body, 'BrandsVietnam');
    }
    async crawlFromCategory(catUrl) {
        const $ = await this.loadCheerioDoc(catUrl);
        const title = $('ul.breadcrumb').siblings().text();
        const category = new Category_1.Category(title, catUrl);
        category.nextPageUrl = $('.pagination .fa.fa-chevron-right').parent().attr('href');
        console.log('Category', category);
        category.articles = await this.crawArticleFromCategory(catUrl);
        return category;
    }
    async crawArticleFromCategory(catUrl) {
        const $ = await this.loadCheerioDoc(catUrl);
        const blogArr = $('.panel-body .row .col-sm-9 .row.m-b-sm').contents().toArray();
        let blogs = await Promise.all(blogArr.map(async ($blog) => {
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
exports.BrandsVietnamCrawler = BrandsVietnamCrawler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJhbmRzVmlldG5hbUNyYXdsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xhc3Nlcy9CcmFuZHNWaWV0bmFtQ3Jhd2xlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEyQztBQUMzQyxnREFBNkM7QUFDN0MseUNBQXNDO0FBQ3RDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxNQUFhLG9CQUFxQixTQUFRLG1CQUFRO0lBQ3pDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFrQjtRQUM5QyxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlELElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFO1lBQ3hCLGlCQUFpQixFQUFFLEVBQ2xCO1NBQ0YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUIsT0FBTyxJQUFJLGlCQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVNLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFjO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkQsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU3QyxRQUFRLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuRixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsQyxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9ELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxLQUFLLENBQUMsdUJBQXVCLENBQUMsTUFBYztRQUNsRCxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakYsSUFBSSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFVLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxFQUFFO1lBQy9ELE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RSxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsWUFBWSxHQUFHLGdCQUFnQixDQUFDO1lBQ3hDLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FDRjtBQTFDRCxvREEwQ0MifQ==