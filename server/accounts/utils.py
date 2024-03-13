from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.template.loader import render_to_string
from decouple import config
from django.conf import settings
from server.utils import generate_unique_token
from .models import User

def send_activation_email(user):
    token = generate_unique_token(User)
    user.verification_token = token
    user.save()

    subject = 'Account Activation Confirmation'
    message = render_to_string('email_templates/registration_email.txt', {
        'user': user,
        'confirmation_link': f'{settings.CLIENT_URL}/confirm-email?token={token}',
        'support_email': config("SUPPORT_EMAIL"),
    })
    recipient_list = [user.email]

    send_mail(subject, message, None, recipient_list)


def send_password_reset_email(user):
    token = generate_unique_token(User)
    user.password_change_token = token
    user.save()

    subject = 'Password Reset Request'
    message = render_to_string('email_templates/reset_password.txt', {
        'user': user,
        'password_reset_link': f'{settings.CLIENT_URL}/password-reset?token={token}',
        'support_email': config("SUPPORT_EMAIL"),
    })
    recipient_list = [user.email]

    send_mail(subject, message, None, recipient_list)