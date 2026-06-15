from django.db import models
from django.contrib.auth.models import User
# Create your models here.

#user = User.objects.create_user(
  #  username="goktug",
 #   password="mypassword123"
#)

class Job(models.Model):
    name = models.CharField(max_length=100, null=False)

    #some stuff
    company = models.CharField(max_length= 100, default= "Unknown")
    notes = models.TextField(max_length=500, blank= True,null=True)

    #work status
    is_applied = models.BooleanField(default = False)
    is_no_response = models.BooleanField(default = True)
    is_rejected = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default = False)
    in_interview_process = models.BooleanField(default = False)
    on_hold = models.BooleanField(default = True) #may apply later

    #work type
    is_remote = models.BooleanField(default = False)
    is_hybrid = models.BooleanField(default = False)
    is_office = models.BooleanField(default = True)

    #times
    day_work_duration = models.IntegerField(default = 0)
    created_at = models.DateTimeField(auto_now_add=True)
    applied_at = models.DateTimeField(null=True, blank=True)

    #extra
    apply_link = models.URLField()

    # FOR EACH USER!!
    user = models.ForeignKey(User, on_delete=models.CASCADE)