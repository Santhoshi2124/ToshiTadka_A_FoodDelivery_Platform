import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    // Link to the user who owns this restaurant
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // This creates the connection to the User model
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    // description: {
    //     type: String,
    //     required: true
    // },
    address: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: 'https://placehold.co/600x400/EFEFEF/AAAAAA?text=No+Image'
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    // We can add more complex review handling later
    numReviews: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
