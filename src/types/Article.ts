export class Article {
  public featureImage: string;
  constructor(
    public title: string,
    public url: string,
    public bodyHtml: string,
    public source: string
  ){}
}
