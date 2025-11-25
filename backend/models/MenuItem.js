import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
    // Link to the restaurant this menu item belongs to
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: 'https://placehold.co/400x400/EFEFEF/AAAAAA?text=No+Image'
    },
    category: {
        type: String,
        required: true,
        default: 'Appetizer'
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
