import { Controller, Get, Res } from "@nestjs/common"
import ArticleService from "./article.service"
import { Response, Request } from "express"

@Controller("articles")
export default class ArticleController {
    
    private articles = new ArticleService()
    
    constructor(){

    }

    @Get("all")
    async getArticles  (req: Request, @Res() res: Response) {
        try {
            
            const data = await this.articles.getArticles()
    
            res.status(200).json( 
                {
                    data,
                    message: "articles fetched successfully",
                    statusCode: 200
                }
            )
        } catch (error) {
            res.json({
                message: error.message,
                statusCode: 400
            })
        }
    }
}