import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
    try {
        const item = localStorage.getItem('user');
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: getInitialUser(),
        token: localStorage.getItem('token') || null,
        userId: localStorage.getItem('userId') || null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const user = action.payload.user || {};
            const token = action.payload.token || null;
            const uid = user.sub || user.id || user.userId || user.preferred_username || user.email || 'user';
            
            state.user = user;
            state.token = token;
            state.userId = uid;

            if (token) {
                localStorage.setItem('token', token);
            }
            if (action.payload.user) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            localStorage.setItem('userId', uid);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.userId = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;