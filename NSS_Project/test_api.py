import unittest
import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000/api"

class TestNGOApp(unittest.TestCase):
    def setUp(self):
        # Unique email for each run
        self.email = f"test_{int(time.time())}@example.com"
        self.password = "password123"
        self.name = "Test User"
        self.user_id = None

    def test_full_flow(self):
        # 1. Register
        print(f"\n[TEST] Registering user: {self.email}")
        res = requests.post(f"{BASE_URL}/register", json={
            "name": self.name,
            "email": self.email,
            "password": self.password
        })
        self.assertEqual(res.status_code, 201)

        # 2. Login
        print("[TEST] Logging in")
        res = requests.post(f"{BASE_URL}/login", json={
            "email": self.email,
            "password": self.password
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.user_id = data['user']['id']
        self.assertIsNotNone(self.user_id)
        print(f"[TEST] Logged in as ID: {self.user_id}")

        # 3. Create Donation
        print("[TEST] Creating Pending Donation")
        res = requests.post(f"{BASE_URL}/donate", json={
            "user_id": self.user_id,
            "amount": 500
        })
        self.assertEqual(res.status_code, 201)
        donation_id = res.json()['donation_id']
        print(f"[TEST] Donation Created with ID: {donation_id}")

        # 4. Confirm Donation (Success)
        print("[TEST] Confirming Donation as Success")
        res = requests.post(f"{BASE_URL}/donate/confirm", json={
            "donation_id": donation_id,
            "status": "success"
        })
        self.assertEqual(res.status_code, 200)

        # 5. Verify History
        print("[TEST] Verifying User History")
        res = requests.get(f"{BASE_URL}/user/history?user_id={self.user_id}")
        history = res.json()
        self.assertTrue(len(history) > 0)
        self.assertEqual(history[0]['status'], 'success')
        print("[TEST] History Verified")

        # 6. Verify Admin Stats (Indirectly)
        print("[TEST] Fetching Admin Stats")
        res = requests.get(f"{BASE_URL}/admin/stats")
        stats = res.json()
        self.assertGreater(stats['total_users'], 0)
        print(f"[TEST] Admin Stats: {stats}")

if __name__ == '__main__':
    print("WARNING: Ensure the Flask app is running on port 5000 before running tests!")
    unittest.main()
