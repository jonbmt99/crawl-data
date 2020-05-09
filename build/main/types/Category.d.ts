import { Article } from './Article';
export declare class Category {
    title: string;
    url: string;
    articles: Article[];
    nextPageUrl: string;
    readonly articleCount: number;
    constructor(title: string, url: string);
}
