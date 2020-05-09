import { Article } from '../types/Article';
import { Category } from '../types/Category';
import { ACrawler } from './ACrawler';
export declare class KiotVietCrawler extends ACrawler {
    crawlFromArticle(articleUrl: string): Promise<Article>;
    crawlFromCategory(catUrl: string): Promise<Category>;
    private crawActicleFromCategory;
}
