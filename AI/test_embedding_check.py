#!/usr/bin/env python3
"""
Test script to verify that the vector store properly checks for existing data
before attempting to embed new documents.
"""

from vector import vector_store

print("Testing vector store data check...")
print("This should show that existing data was detected and no new embedding was performed.")