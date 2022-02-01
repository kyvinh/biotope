import {HasUserIdAuthGuard} from "../../../lib/serverAnnotations";
import {createHandler, Post} from "@storyofams/next-api-decorators";

@HasUserIdAuthGuard()
class ImageUploadHandler {
    @Post()
    async create(/*@Body() body, @UploadedFile() singleFile, @UploadedFiles() files, @Query('userId') userId: string*/) {
        // console.log('body', body)
        // console.log('single', singleFile)
        // console.log('files', files)
        return {}
    }
}

export default createHandler(ImageUploadHandler);