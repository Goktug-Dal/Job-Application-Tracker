from django.test import TestCase

# Create your tests here.
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User

class JobAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        response = self.client.post('/api/token/', {'username': 'testuser', 'password': 'testpassword'})
        self.token = response.data['access']
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_get_all_jobs_authorized(self):
        response = self.client.get('/api/getAll/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)