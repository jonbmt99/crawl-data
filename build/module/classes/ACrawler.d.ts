import { Article } from '../types/Article';
import { Category } from '../types/Category';
export declare abstract class ACrawler {
    loadHtmlFromUrl(url: string): Promise<any>;
    loadCheerioDoc(url: string): Promise<any>;
    abstract crawlFromCategory(catUrl: string): Promise<Category>;
    abstract crawlFromArticle(articleUrl: string): Promise<Article>;
}
