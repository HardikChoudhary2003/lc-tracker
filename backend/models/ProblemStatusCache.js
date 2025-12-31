import mongoose from 'mongoose';

const problemStatusCacheSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    problemSlug: {
        type: String,
        required: true,
    },
    isSolved: {
        type: Boolean,
        required: true,
    },
    lastChecked: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Add indexes for efficient querying
problemStatusCacheSchema.index({ userId: 1, problemSlug: 1 }, { unique: true }); // Ensure unique entry per user/problem
problemStatusCacheSchema.index({ userId: 1, lastChecked: -1 }); // Index for potentially cleaning up old cache entries

const ProblemStatusCache = mongoose.model('ProblemStatusCache', problemStatusCacheSchema);

export default ProblemStatusCache;