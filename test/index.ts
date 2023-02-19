import {AddLikeDTO, LikeType} from "./proto/likes_pb";
import {LikesServiceClient} from "./proto/LikesServiceClientPb";

const createLike = (new AddLikeDTO())
const likesServiceClient = new LikesServiceClient("localhost:5000", null, null)

createLike.setType(LikeType.POST)
createLike.setItemId("rwefwefwe")
createLike.setUserId("ilya")

likesServiceClient.addLike(createLike, {}, (err, res) => {
    console.log(res)
})