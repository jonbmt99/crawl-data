"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Category {
    constructor(title, url) {
        this.title = title;
        this.url = url;
        this.nextPageUrl = '';
        this.articles = [];
    }
    get articleCount() {
        return this.articles.length;
    }
}
exports.Category = Category;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdHlwZXMvQ2F0ZWdvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFhLFFBQVE7SUFTbkIsWUFDUyxLQUFhLEVBQ2IsR0FBVztRQURYLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBUmIsZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFVdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQVRELElBQVcsWUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFBO0lBQzdCLENBQUM7Q0FRRjtBQWZELDRCQWVDIn0=