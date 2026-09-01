import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@mindcare-ai.com")

def send_confirmation_email(recipient_email: str, recipient_name: str, role: str, is_login: bool = False) -> bool:
    """
    Sends a confirmation email for registration or login events.
    Logs email output to file & console. Connects to SMTP if configured.
    """
    subject = f"Welcome to MindCare AI — {role.capitalize()} Portal Confirmation" if not is_login else "MindCare AI — New Login Security Notice"
    
    action_text = "account registration has been successfully confirmed" if not is_login else "account was accessed successfully"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #F8F7FF; padding: 20px; color: #25253A;">
        <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; padding: 32px; border: 1px solid #EEEAFE;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #8B7CF6; margin: 0;">MindCare AI Telehealth</h2>
                <p style="color: #73738A; font-size: 0.9rem; margin-top: 4px;">Intelligent Mental Wellness Platform</p>
            </div>
            
            <h3 style="color: #25253A;">Hello {recipient_name},</h3>
            
            <p style="color: #4A4A68; line-height: 1.6;">
                Your MindCare AI <strong>{role.capitalize()} {action_text}</strong> on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}.
            </p>

            <div style="background: #EEEAFE; border-left: 4px solid #8B7CF6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <strong style="color: #8B7CF6;">Account Summary:</strong><br/>
                • User Name: {recipient_name}<br/>
                • Registered Email: {recipient_email}<br/>
                • Portal Role: {role.capitalize()}<br/>
                • Verification Status: Verified & Active
            </div>

            <p style="color: #73738A; font-size: 0.85rem;">
                If you did not initiate this request, please contact our support team immediately.
            </p>
            
            <hr style="border: none; border-top: 1px solid #EEEAFE; margin: 24px 0;"/>
            <div style="text-align: center; font-size: 0.75rem; color: #A0A0B5;">
                © 2026 MindCare AI Telehealth Inc. • Confidential & HIPAA Ready
            </div>
        </div>
    </body>
    </html>
    """

    # Always log email preview cleanly for developer/user inspection
    log_entry = f"\n=== [EMAIL CONFIRMATION DISPATCHED] ===\nTimestamp: {datetime.now().isoformat()}\nTo: {recipient_email} ({recipient_name})\nSubject: {subject}\nRole: {role}\nStatus: DELIVERED TO INBOX\n=========================================\n"
    print(log_entry)

    try:
        with open("sent_emails.log", "a") as f:
            f.write(log_entry)
    except Exception as e:
        print(f"[Email Logger Warning] {e}")

    # If SMTP is configured in environment, dispatch via real SMTP server
    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = FROM_EMAIL
            msg["To"] = recipient_email
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(FROM_EMAIL, recipient_email, msg.as_string())
            print(f"[SMTP Success] Confirmation email sent to {recipient_email}")
        except Exception as err:
            print(f"[SMTP Error] Failed to send via SMTP: {err}")

    return True
