# 1. Login
curl -X POST -d "username=user1&password=password1" http://localhost:3000/login

# 2. Protected page
curl http://localhost:3000/dashboard

# 3. Logout
curl http://localhost:3000/logout
