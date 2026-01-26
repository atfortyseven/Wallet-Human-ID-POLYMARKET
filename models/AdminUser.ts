import mongoose from 'mongoose';

const AdminUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
});

export default mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
