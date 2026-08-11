<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Accepted</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4eddf; margin: 0; padding: 40px 20px; color: #2a2521; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #fbf6ec; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(42,37,33,0.08);">
        <tr>
            <td style="padding: 50px 40px 20px; text-align: center;">
                <img src="{{ $message->embed(public_path('images/logo.png')) }}" alt="CoFarm & Partners" style="height: 64px; margin-bottom: 24px;">
                <h1 style="color: #2d3f31; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Congratulations!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 40px 10px; color: #52493e; font-size: 16px;">
                <p style="margin-top: 0;">Dear {{ $investmentRequest->prenom }} {{ $investmentRequest->nom }},</p>
                
                <p>We are pleased to inform you that your request to create an investment account has been <strong style="color: #2d3f31;">accepted</strong> by our administration.</p>
                
                <p>Our team is currently setting up your secure dashboard. You will receive another email very soon containing your login credentials and instructions on how to access your portal.</p>
                
                <p>We thank you for your trust and look forward to collaborating with you.</p>
                
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
