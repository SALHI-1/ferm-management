<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login Credentials</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4eddf; margin: 0; padding: 40px 20px; color: #2a2521; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #fbf6ec; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(42,37,33,0.08);">
        <tr>
            <td style="padding: 50px 40px 20px; text-align: center;">
                <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="CoFarm & Partners" style="height: 64px; margin-bottom: 24px;">
                <h1 style="color: #2d3f31; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Welcome to your portal</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 40px 10px; color: #52493e; font-size: 16px;">
                <p style="margin-top: 0;">Dear {{ $user->prenom }} {{ $user->nom }},</p>
                
                <p>Following the approval of your investment request, your account has been successfully created by our administration team.</p>
                
                <p>You can now log in to your personal dashboard using the credentials below:</p>
                
                <div style="background-color: #ffffff; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid rgba(42,37,33,0.06); border-left: 4px solid #bc6b43; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
                    <p style="margin: 0 0 12px; color: #2a2521;"><strong>Email:</strong> {{ $user->email }}</p>
                    <p style="margin: 0; color: #2a2521;"><strong>Password:</strong> <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 15px; background: #f8f9fa; padding: 2px 6px; border-radius: 4px; border: 1px solid #eee;">{{ $password }}</span></p>
                </div>
                
                <p>We highly recommend that you change this password upon your first login for security reasons.</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                    <tr>
                        <td align="center">
                            <a href="https://cofarmandpartners.com/login" style="display: inline-block; padding: 16px 36px; background-color: #bc6b43; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 6px 20px rgba(188,107,67,0.25);">Access My Dashboard</a>
                        </td>
                    </tr>
                </table>
                
                <p>If you encounter any difficulties logging in, please do not hesitate to contact us.</p>
                
                <p style="margin-bottom: 0;">Best regards,<br>
                <strong style="color: #2d3f31;">The Administration Team</strong></p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px 40px 40px; text-align: center; font-size: 13px; color: #8a8174; border-top: 1px solid rgba(42,37,33,0.06); margin-top: 20px;">
                <p style="margin: 0;">&copy; {{ date('Y') }} CoFarm Dairy Partners. All rights reserved.</p>
                <p style="margin: 5px 0 0;">This email was sent automatically, please do not reply directly.</p>
            </td>
        </tr>
    </table>
</body>
</html>
