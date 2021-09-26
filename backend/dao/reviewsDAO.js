import mongodb from "mongodb"
const objectId = mongodb.ObjectID

let reviews 

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            //if reviews is not null then return 
            return
        }
        //if reviews is null 
        try {
            // if this node doesn't exist then it will be automatically created when we add data to it
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        }
        catch(e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                restaurant_id: objectId(restaurantId) }

            //insert into the database
            //return await reviews.insertOne(reviewDoc)

            return await reviews.insertOne(reviewDoc)
                    .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
                    .catch(err => console.error(`Failed to insert item: ${err}`))
        }
        catch(e) {
            console.error(`Unable to post review: ${e}`)
            return {error: e}
        }
    }
    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id:objectId(reviewId)},
                { $set: { text: text, date: date } },
            )

            return updateResponse
        }
        catch(e) {
            console.error(`Unable to update review: ${e}`)
            return {error: e}
        }
    }
    static async deleteReview(reviewId, useerId) {
        try {
            const deleteResponse = await reviews.deleteOne(
                {   _id:objectId(reviewId),
                    user_id: useerId
                })

            return deleteResponse
        }
        catch(e) {
            console.error(`Unable to delete review: ${e}`)
            return {error: e}
        }
    }

}