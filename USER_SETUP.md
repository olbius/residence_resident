# User Setup Guide for Residence Resident Portal

## Overview
The Residence Resident Portal allows residents to view their family information, invoices, payments, and registered vehicles. To access the portal, users must be properly configured in the backend system.

## Prerequisites

For a user to successfully log in to the Residence Resident Portal, the following must be configured in the Moqui backend:

### 1. User Account
The user must have a valid Moqui user account with:
- Username and password
- A `partyId` associated with the user account

### 2. Residence Family Association
The user must be associated with a residence family in **one of two ways**:

#### Option A: Family Owner
The user's `partyId` must exist in the `FamilyOwner` table:
```sql
-- Example: User is an owner of a family
INSERT INTO residence.FamilyOwner (familyPartyId, ownerPartyId, fromDate, ownershipPercentage)
VALUES ('FAMILY_001', 'USER_PARTY_ID', '2024-01-01', 100);
```

#### Option B: Family Member  
The user's `partyId` must exist in the `FamilyMember` table:
```sql
-- Example: User is a member of a family
INSERT INTO residence.FamilyMember (familyPartyId, memberPartyId, fromDate, memberType, relationshipToOwner)
VALUES ('FAMILY_001', 'USER_PARTY_ID', '2024-01-01', 'FmtDependent', 'Spouse');
```

### 3. User Group Membership
The user must be in the `RESIDENCE_RESIDENT` user group:
```sql
-- Add user to resident group
INSERT INTO moqui.security.UserGroupMember (userGroupId, userId, fromDate)
VALUES ('RESIDENCE_RESIDENT', 'username', NOW());
```

## Verification Steps

### Step 1: Verify User Account
Check that the user exists and has a partyId:
```sql
SELECT userId, username, partyId 
FROM moqui.security.UserAccount 
WHERE username = 'your_username';
```

### Step 2: Verify Family Association
Check if user is an owner:
```sql
SELECT * FROM residence.FamilyOwner 
WHERE ownerPartyId = 'USER_PARTY_ID' 
AND thruDate IS NULL;
```

Or check if user is a member:
```sql
SELECT * FROM residence.FamilyMember 
WHERE memberPartyId = 'USER_PARTY_ID' 
AND thruDate IS NULL;
```

### Step 3: Verify User Group
Check if user is in RESIDENCE_RESIDENT group:
```sql
SELECT * FROM moqui.security.UserGroupMember 
WHERE userId = 'username' 
AND userGroupId = 'RESIDENCE_RESIDENT'
AND (thruDate IS NULL OR thruDate > NOW());
```

## Common Issues

### Error: "Access denied. This portal is for residents only."

**Cause**: The user is not associated with any family or doesn't have resident permissions.

**Solution**:
1. Verify the user has a `partyId` in their user account
2. Add the user as either a family owner or member
3. Add the user to the `RESIDENCE_RESIDENT` user group
4. Ensure there are no `thruDate` values set (or they are in the future)

### Error: "User not associated with a party"

**Cause**: The user account doesn't have a `partyId` field set.

**Solution**: Update the user account to include a partyId:
```sql
UPDATE moqui.security.UserAccount 
SET partyId = 'USER_PARTY_ID' 
WHERE username = 'username';
```

### Error: "User is not associated with any residence family"

**Cause**: The user has a `partyId` but is not linked to any family.

**Solution**: Add the user to a family as either an owner or member (see Section 2 above).

## Testing with Sample Data

Here's a complete example to set up a test resident:

```sql
-- 1. Create/verify user account has partyId
UPDATE moqui.security.UserAccount 
SET partyId = 'DEMO_RESIDENT_001' 
WHERE username = 'demo_resident';

-- 2. Add user to RESIDENCE_RESIDENT group
INSERT INTO moqui.security.UserGroupMember (userGroupId, userId, fromDate)
VALUES ('RESIDENCE_RESIDENT', 'demo_resident', '2024-01-01');

-- 3. Create or link to an existing family
-- Assuming family 'FAMILY_A101' exists
INSERT INTO residence.FamilyMember (
    familyPartyId, memberPartyId, fromDate, memberType, relationshipToOwner
) VALUES (
    'FAMILY_A101', 'DEMO_RESIDENT_001', '2024-01-01', 'FmtPrimary', 'Self'
);
```

## API Endpoints Used

The portal uses these endpoints after login:
- `POST /rest/login` - Moqui standard authentication
- `GET /rest/s1/residence/my/family` - Verify resident access and get family info
- `GET /rest/s1/residence/my/members` - Get family members
- `GET /rest/s1/residence/my/vehicles` - Get registered vehicles
- `GET /rest/s1/residence/my/balance` - Get outstanding balance
- `GET /rest/s1/residence/my/invoices` - Get invoices
- `GET /rest/s1/residence/my/payments` - Get payment history
- `GET /rest/s1/residence/my/allocations` - Get fee allocations
- `POST /rest/logout` - Logout

## Support

For additional assistance, check the browser console for detailed error messages when login fails. The application logs specific error responses from the backend that can help identify the issue.
