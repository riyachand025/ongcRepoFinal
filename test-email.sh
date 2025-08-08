#!/bin/bash

echo "🧪 Testing ONGC Email Functionality"
echo "===================================="

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start it first:"
    echo "   cd server && npm start"
    exit 1
fi

# Test email endpoint
echo ""
echo "📧 Testing email endpoint..."
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "dkapil3722@gmail.com",
    "subject": "ONGC Email Test",
    "html": "<h1>Test Email</h1><p>This is a test email from ONGC system.</p>"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "📊 Check server logs for detailed email status:"
echo "   tail -f server/logs/ongc-server.log" 