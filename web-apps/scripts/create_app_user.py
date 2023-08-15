#!/usr/bin/python
import os
import re
import sys
import argparse
import firebase_admin

from firebase_admin import auth
from firebase_admin import firestore


parser = argparse.ArgumentParser(description='Create app user in Firebase.')
parser.add_argument('--env', type=str, default='dev', help='Environment in which to create the user (default: dev).')
parser.add_argument('--email', type=str, default=None, help='(default: None).')
parser.add_argument('--password', type=str, default=None, help='(default: None).')
parser.add_argument('--full-name', type=str, default=None, help='(default: None).')
parser.add_argument('--account-id', type=str, default=None, help='(default: None).')
args = parser.parse_args()


project_id = f'ag-edgekit-{args.env}'
credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', None)

# Validate service account
if not credentials:
    print('You must have GOOGLE_APPLICATION_CREDENTIALS set, with access to: {project_id}')

# Validate password
if len(args.password) < 8:
    print('Password must be > 8 chars.')
    sys.exit()

# Validate email
if not re.match(r'[^@]+@[^@]+\.[^@]+', args.email):
    print('Email must be valid.')
    sys.exit()

# Validate full name
if len(args.full_name.split(' ')) != 2:
    print('Full name should be made of 2 parts.')
    sys.exit()

firebase_admin.initialize_app(options={'projectId': project_id})

# Check if the user already exists
try:
    auth.get_user_by_email(args.email)
    print('User already exists, exiting.')
    sys.exit()
except:
    pass

try:
    user = auth.create_user(email=args.email, email_verified=True, password=args.password)
except Exception as ex:
    print(f'User creation failed, with exception: {ex}')

# Add accountId and fullName to users collection.
db = firestore.client()

db.collection(u'users').document(user.uid).set({
    'accountId': str(args.account_id),
    'fullName': str(args.full_name),
})

print(f'User created with uid: {user.uid}')
