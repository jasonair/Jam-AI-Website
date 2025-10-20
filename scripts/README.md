# Admin Scripts

## Set Admin Claim Script

This script allows you to manage admin custom claims for Firebase users.

### Prerequisites

1. Firebase Admin SDK installed (run `npm install firebase-admin` if needed)
2. Firebase service account key JSON file

### Getting Your Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project Settings
4. Navigate to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Save the downloaded file as `serviceAccountKey.json` in this `scripts` directory

**IMPORTANT**: Never commit this file to git. It's already in `.gitignore`.

### Usage

#### Set Admin Claim

```bash
node scripts/set-admin-claim.js set admin@example.com
```

This will:
- Find the user by email
- Set the `admin: true` custom claim
- Verify the claim was set successfully

#### Remove Admin Claim

```bash
node scripts/set-admin-claim.js remove user@example.com
```

#### List All Admins

```bash
node scripts/set-admin-claim.js list
```

### Important Notes

1. **User Must Re-authenticate**: After setting the admin claim, the user must sign out and sign back in for the claim to take effect.

2. **User Must Exist**: The user must already exist in Firebase Authentication before you can set their admin claim.

3. **Security**: Keep your service account key secure. Never share it or commit it to version control.

### Troubleshooting

**Error: Could not find serviceAccountKey.json**
- Download the service account key from Firebase Console
- Save it in the `scripts` directory with the exact name `serviceAccountKey.json`

**Error: No user found with email**
- Create the user in Firebase Console → Authentication first
- Verify the email address is correct

**Error: Permission denied**
- Ensure your service account has the necessary permissions
- Check that you're using the correct Firebase project

### Example Workflow

1. Create a new user in Firebase Console:
   - Go to Authentication → Users
   - Click "Add User"
   - Enter email and password

2. Set admin claim:
   ```bash
   node scripts/set-admin-claim.js set newadmin@jamai.com
   ```

3. User signs in at `/admin/login`

4. User is redirected to `/admin/dashboard`

### Security Best Practices

- Only give admin access to trusted individuals
- Regularly audit admin users using the `list` command
- Remove admin access when no longer needed
- Use strong passwords for admin accounts
- Enable 2FA on admin Firebase accounts
