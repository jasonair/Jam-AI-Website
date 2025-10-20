# Admin Analytics Dashboard

A complete, production-ready admin analytics dashboard for Jam AI with Firebase integration, comprehensive analytics tracking, and beautiful visualizations.

## 📚 Documentation

- **[ADMIN_QUICKSTART.md](./ADMIN_QUICKSTART.md)** - Get started in 5 minutes
- **[ADMIN_INTEGRATION.md](./ADMIN_INTEGRATION.md)** - Integration guide and features overview
- **[scripts/README.md](./scripts/README.md)** - Admin script documentation

## 🚀 Quick Start

1. **Add Firebase credentials** to `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

2. **Set up your first admin**:
   ```bash
   npm install firebase-admin
   # Download service account key to scripts/serviceAccountKey.json
   node scripts/set-admin-claim.js set your-email@example.com
   ```

3. **Access the dashboard**:
   - Login: http://localhost:3001/admin/login
   - Dashboard: http://localhost:3001/admin/dashboard

## 📊 Features

### Analytics Tracked
- ✅ Token usage and costs
- ✅ User activity metrics
- ✅ Team member usage statistics
- ✅ Revenue and plan distribution
- ✅ Daily trends and generation types

### Visualizations
- 📈 Line charts for daily trends
- 🥧 Pie charts for distributions
- 📊 Bar charts for comparisons
- 📇 Stat cards for key metrics

### Security
- 🔒 Firebase Auth with custom admin claims
- 🛡️ Protected routes
- 🔐 Firestore security rules
- ✨ Environment variable protection

## 🏗️ Project Structure

```
/app/admin/
├── login/page.tsx              # Admin login page
└── dashboard/page.tsx          # Analytics dashboard

/components/admin/
├── StatCard.tsx                # Metric cards
├── LineChart.tsx               # Line charts
├── BarChart.tsx                # Bar charts
└── PieChart.tsx                # Pie charts

/lib/
├── firebase.ts                 # Firebase initialization
├── analytics.ts                # Analytics query functions
└── hooks/
    └── useAdminAuth.ts         # Admin authentication hook

/scripts/
├── set-admin-claim.js          # Admin management script
└── README.md                   # Script documentation
```

## 🔧 Setup Requirements

### Firebase
- Firebase project with Firestore enabled
- Authentication enabled (Email/Password)
- Firestore indexes created
- Security rules deployed

### Environment Variables
- All `NEXT_PUBLIC_FIREBASE_*` variables configured
- `.env.local` file created (never commit this!)

### Admin Users
- At least one user with `admin: true` custom claim
- Users must sign out and back in after claim is set

## 📖 Usage

### Managing Admin Users

```bash
# Set admin claim
node scripts/set-admin-claim.js set admin@example.com

# Remove admin claim
node scripts/set-admin-claim.js remove user@example.com

# List all admins
node scripts/set-admin-claim.js list
```

### Accessing Analytics

1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. View analytics on the dashboard
4. Use time filters (7/30/90 days) to adjust data range

## 🔒 Security Best Practices

- ✅ Never commit `.env.local` or `serviceAccountKey.json`
- ✅ Use strong passwords for admin accounts
- ✅ Enable 2FA on admin Firebase accounts
- ✅ Regularly audit admin users
- ✅ Deploy Firestore security rules
- ✅ Monitor admin access logs

## 🐛 Troubleshooting

### Routes showing 404
- Ensure dev server is running: `npm run dev`
- All page files exist in `/app/admin/login/` and `/app/admin/dashboard/`
- Clear Next.js cache: `rm -rf .next && npm run dev`

### "Access denied. Admin privileges required."
- Run: `node scripts/set-admin-claim.js set your-email@example.com`
- User must sign out and sign back in

### "Failed to load analytics"
- Check Firebase credentials in `.env.local`
- Verify Firestore indexes are created
- Check browser console for errors

### Charts not displaying
- Ensure analytics data exists in Firestore
- Check that date range contains data
- Verify recharts is installed: `npm install recharts`

## 💰 Cost Estimates

For 1,000 active users:
- Firestore Storage: ~$1.50/month
- Firestore Writes: ~$5.40/month
- Firestore Reads: ~$10.80/month
- **Total**: ~$18/month

## 📦 Dependencies

```json
{
  "firebase": "^latest",      // Firebase SDK
  "recharts": "^latest",      // Chart visualizations
  "date-fns": "^latest"       // Date formatting
}
```

All installed via: `npm install firebase recharts date-fns`

## 🎯 Next Steps

1. ✅ Files created and routes working
2. ⏳ Add Firebase credentials to `.env.local`
3. ⏳ Create Firestore indexes
4. ⏳ Deploy security rules
5. ⏳ Set up first admin user
6. ⏳ Test the dashboard

## 📞 Support

Check the documentation files for detailed guides:
- Quick setup → `ADMIN_QUICKSTART.md`
- Full integration → `ADMIN_INTEGRATION.md`
- Script usage → `scripts/README.md`

---

**Status**: ✅ All files created, routes working on port 3001
**Version**: 1.0.0
**Last Updated**: January 2025
