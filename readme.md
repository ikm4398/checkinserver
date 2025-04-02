## Environment Variables

Configure the following environment variables in a `.env` file:

```
# Server Configuration
IP_ADDRESS=0.0.0.0
PORT=5001

# Database Configuration
MONGO_URI=mongodb://username:password@127.0.0.1:27017/attendance_db?authSource=admin  or mongodb://127.0.0.1:27017/attendance_db

# ERP Configuration
ERP_USERNAME=erp_username
ERP_PASSWORD=erp_password
API_URL=erp_url
```

# Mongodb Setup from mongodb install ducumentation

```
# Auto run Mongodb when boot
sudo systemctl enable mongod

```
