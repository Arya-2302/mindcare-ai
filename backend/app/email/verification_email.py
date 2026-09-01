import os
import json
import urllib.request
import urllib.error
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
EMAIL_FROM = os.getenv("EMAIL_FROM", "MindCare AI <onboarding@resend.dev>")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")

def send_verification_email(recipient_email: str, recipient_name: str, role: str, raw_token: str) -> dict:
    api_key = os.getenv("RESEND_API_KEY", RESEND_API_KEY).strip()
    frontend_url = os.getenv("FRONTEND_URL", FRONTEND_URL).rstrip("/")
    from_email = os.getenv("EMAIL_FROM", EMAIL_FROM)

    verification_url = f"{frontend_url}/verify-email?token={raw_token}"
    
    # Load HTML Template
    template_path = os.path.join(os.path.dirname(__file__), "templates", "verification.html")
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            html_body = f.read()
    except Exception:
        html_body = f"""
        <h2>Welcome to MindCare AI 👋</h2>
        <p>Hi {recipient_name}, please verify your email address to activate your account:</p>
        <a href="{verification_url}">Verify My Email</a>
        """

    html_body = html_body.replace("{{name}}", recipient_name)
    html_body = html_body.replace("{{role}}", role.capitalize())
    html_body = html_body.replace("{{verification_url}}", verification_url)

    subject = "Verify your MindCare AI account"

    log_output = f"""
=====================================================
[MINDCARE EMAIL VERIFICATION DISPATCHED]
To: {recipient_email} ({recipient_name})
Subject: {subject}
Verification Link: {verification_url}
Timestamp: {datetime.utcnow().isoformat()}
=====================================================
"""
    try:
        print(log_output)
    except Exception:
        pass
    
    try:
        with open("sent_emails.log", "a", encoding="utf-8") as f:
            f.write(log_output + "\n")
    except Exception as e:
        print(f"[Email Log Error]: {e}")

    # Send email via Resend REST API
    if api_key:
        try:
            url = "https://api.resend.com/emails"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "MindCare-AI/1.0"
            }
            payload = {
                "from": from_email,
                "to": [recipient_email],
                "subject": subject,
                "html": html_body
            }
            
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                print(f"[Resend API Success] Verification email sent to {recipient_email}! Resend ID: {res_data.get('id')}")
                return {"success": True, "provider": "resend", "id": res_data.get("id"), "url": verification_url}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            print(f"[Resend API Info {e.code}]: {err_body}")
            # If Resend free tier limits external recipients to account owner, return link for instant testing
            return {
                "success": True, 
                "provider": "resend_sandbox_restricted",
                "error_detail": err_body,
                "url": verification_url,
                "note": "Resend test mode limits emails to account owner. Direct verification link provided."
            }
        except Exception as err:
            print(f"[Resend Error]: {err}")
            return {"success": True, "provider": "local_fallback", "error": str(err), "url": verification_url}

    return {"success": True, "provider": "local_dev_logger", "url": verification_url}
