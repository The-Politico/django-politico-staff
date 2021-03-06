from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .celery import sync_slack_users


@receiver(post_save, sender=User)
def auto_staff(sender, instance, created, **kwargs):
    """Automatically promote user to staff if email is politico.com.
    """
    if created:
        if instance.email[-13:] == "@politico.com" and not instance.is_staff:
            instance.is_staff = True
            instance.save()
            if instance.pk:
                sync_slack_users.delay([instance.pk])
