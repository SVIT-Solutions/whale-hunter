from django.db import models


class Network(models.Model):
    name = models.CharField(max_length=255, blank=False)
    abbreviation = models.CharField(max_length=10, blank=False)
    coin_name = models.CharField(max_length=10, blank=False)

    USERNAME_FIELD = "name"
    REQUIRED_FIELDS = ["name", "abbreviation", "coin_name"]

    class Meta:
        verbose_name = "Network"
        verbose_name_plural = "Networks"