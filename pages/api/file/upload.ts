import {HasUserIdAuthGuard} from "../../../lib/serverAnnotations";
import {Body, createHandler, Post, Query, Req, UploadedFile, UploadedFiles} from "@storyofams/next-api-decorators";

/*
https://stackoverflow.com/questions/62411430/post-multipart-form-data-to-serverless-next-js-api-running-on-vercel-now-sh
Try multer? https://stackoverflow.com/a/68882562

// disable next.js' default body parser
export const config = {
    api: { bodyParser: false }
}
*/

@HasUserIdAuthGuard()
class ImageUploadHandler {
    @Post()
    async create(@Body() body, @UploadedFile() singleFile, @UploadedFiles() files, @Query('userId') userId: string, @Req() req) {

        console.log('body', body)
        console.log('single', singleFile)
        console.log('files', files)

        return {}
    }
}

export default createHandler(ImageUploadHandler);