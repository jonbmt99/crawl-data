import { Article } from './Article';

export class Category {
  public articles: Article[];

  public nextPageUrl = '';

  public get articleCount(): number {
    return this.articles.length
  }

  constructor(
    public title: string,
    public url: string,
  ){
    this.articles = [];
  }
}
