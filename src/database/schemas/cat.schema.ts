import * as mongoose from 'mongoose';

export const CatSchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: Number,
    breed: {type: String, required: true},
});