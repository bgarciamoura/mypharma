import mongoose from 'mongoose';

const BrandsSchema = new mongoose.Schema({
    UUID: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Brands = mongoose.model('Brands', BrandsSchema);

export { Brands };
