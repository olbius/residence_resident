#!/bin/bash

# Test script to verify Residence Resident API access
# Usage: ./test-api.sh <username> <password>

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <password>"
    exit 1
fi

USERNAME=$1
PASSWORD=$2
BASE_URL="http://localhost:8080"

echo "========================================="
echo "Testing Residence Resident API Access"
echo "========================================="
echo ""

# Step 1: Login
echo "Step 1: Authenticating user '$USERNAME'..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/rest/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extract session token
SESSION_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.moquiSessionToken' 2>/dev/null)

if [ -z "$SESSION_TOKEN" ] || [ "$SESSION_TOKEN" = "null" ]; then
    echo "ERROR: Failed to get session token. Login failed."
    exit 1
fi

echo "Session Token: $SESSION_TOKEN"
echo ""

# Step 2: Test /my/family endpoint
echo "Step 2: Testing /rest/s1/residence/my/family..."
FAMILY_RESPONSE=$(curl -s -X GET "$BASE_URL/rest/s1/residence/my/family" \
  -H "Content-Type: application/json" \
  -H "moquiSessionToken: $SESSION_TOKEN")

echo "Family Response:"
echo "$FAMILY_RESPONSE" | jq . 2>/dev/null || echo "$FAMILY_RESPONSE"
echo ""

# Step 3: Check if there are errors
if echo "$FAMILY_RESPONSE" | grep -q "errors"; then
    echo "ERROR: Access to family endpoint failed!"
    echo ""
    echo "Possible issues:"
    echo "1. User account doesn't have a partyId set"
    echo "2. User is not linked to a family (not in FamilyOwner or FamilyMember table)"
    echo "3. User is not in RESIDENCE_RESIDENT user group"
    echo "4. User doesn't have authorization to access the service"
    echo ""
    echo "Check USER_SETUP.md for detailed setup instructions."
    exit 1
fi

# Step 4: Test other endpoints
echo "Step 3: Testing /rest/s1/residence/my/members..."
MEMBERS_RESPONSE=$(curl -s -X GET "$BASE_URL/rest/s1/residence/my/members" \
  -H "Content-Type: application/json" \
  -H "moquiSessionToken: $SESSION_TOKEN")

echo "Members Response:"
echo "$MEMBERS_RESPONSE" | jq . 2>/dev/null || echo "$MEMBERS_RESPONSE"
echo ""

echo "Step 4: Testing /rest/s1/residence/my/balance..."
BALANCE_RESPONSE=$(curl -s -X GET "$BASE_URL/rest/s1/residence/my/balance" \
  -H "Content-Type: application/json" \
  -H "moquiSessionToken: $SESSION_TOKEN")

echo "Balance Response:"
echo "$BALANCE_RESPONSE" | jq . 2>/dev/null || echo "$BALANCE_RESPONSE"
echo ""

echo "========================================="
echo "Test Complete"
echo "========================================="
