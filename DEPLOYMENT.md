# Deployment Checklist

## Local Testing
1. ✅ Ensure backend is running on http://localhost:5000
2. ✅ Test frontend locally with `npm run dev`
3. ✅ Verify API calls work in development mode

## Production Build

### For Vercel (Automatic):
- ✅ Just push to GitHub - Vercel handles everything automatically
- ✅ Set environment variable: `VITE_API_URL=https://quraninstasnap.onrender.com/api`

### For Other Hosting (Manual):
1. ✅ Build the app: `npm run build`
2. ✅ Test production build locally: `npm start` (runs on port 4173)
3. ✅ Upload `dist/` folder to your hosting service

## Environment Configuration
- **Development**: Uses proxy to localhost:5000
- **Production**: Uses https://quraninstasnap.onrender.com/api

## API Endpoints Being Used
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/patients` - Patient management
- `GET /api/admin/doctors` - Doctor management
- `GET /api/admin/appointments` - Appointment management

## Admin Credentials
- Email: qasimr.r123@gmail.com
- Password: admin123

## Deployment Steps
1. Run `npm run build` to create production build
2. Upload `dist/` folder to your hosting service
3. Configure your hosting to serve the SPA correctly
4. Ensure backend is deployed and accessible at https://quraninstasnap.onrender.com

## Testing Production
After deployment, test these key features:
- [ ] Login with admin credentials
- [ ] Dashboard loads with statistics
- [ ] Patient management page works
- [ ] Doctor management page works
- [ ] Appointment management page works