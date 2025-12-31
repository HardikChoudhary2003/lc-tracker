import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    titleSlug: { // LeetCode's unique identifier for the problem
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    credit:{
        type: Number,
        required: true,
    }
    // Add other relevant problem details if available from the public API
    // e.g., difficulty, frontend_id, etc.
});

const contestSchema = new mongoose.Schema({
    titleSlug: { // LeetCode's unique identifier for the contest
        type: String,
        required: true,
        unique: true, // Ensure we don't store duplicate contests
    },
    title: {
        type: String,
        required: true,
    },
    startTime: { // Unix timestamp or Date object
        type: Date, // Store as Date for easier querying
        required: true,
    },
    duration: { // Duration in seconds
        type: Number,
        required: true,
    },
    link: { // URL to the solution video/explanation (typically YouTube)
        type: String,
        default: '',
    },
    link2: { // Optional second URL (e.g., from a different channel)
        type: String,
        default: '',
    },
    problems: [problemSchema], // Array of problems in the contest
    lastFetched: { // Timestamp of when this contest data was last updated
        type: Date,
        default: Date.now,
    },
});

// Index for finding contests efficiently
// contestSchema.index({ titleSlug: 1 }); // Removed as unique:true already creates an index
contestSchema.index({ startTime: -1 }); // To easily find upcoming/recent contests

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;
