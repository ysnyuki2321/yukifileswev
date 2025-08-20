#!/usr/bin/env python3
"""
YukiFiles Python Integration Example
This script demonstrates how to interact with YukiFiles API using Python
"""

import requests
import json
import os
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import hashlib
import mimetypes

class YukiFilesClient:
    """Python client for YukiFiles API"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.yukifiles.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })
    
    def upload_file(self, file_path: str, description: str = None) -> Dict:
        """
        Upload a file to YukiFiles
        
        Args:
            file_path: Path to the file to upload
            description: Optional description for the file
            
        Returns:
            Dict containing file information
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Get file information
        file_size = os.path.getsize(file_path)
        file_name = os.path.basename(file_path)
        mime_type, _ = mimetypes.guess_type(file_path)
        
        # Calculate file hash
        file_hash = self._calculate_file_hash(file_path)
        
        # Prepare upload data
        upload_data = {
            "name": file_name,
            "size": file_size,
            "type": mime_type or "application/octet-stream",
            "hash": file_hash
        }
        
        if description:
            upload_data["description"] = description
        
        # Create upload session
        response = self.session.post(f"{self.base_url}/uploads", json=upload_data)
        response.raise_for_status()
        
        upload_info = response.json()["data"]
        
        # Upload file content
        with open(file_path, 'rb') as file:
            files = {'file': (file_name, file, mime_type)}
            upload_response = requests.post(
                upload_info["upload_url"],
                files=files,
                headers=upload_info["headers"]
            )
            upload_response.raise_for_status()
        
        return upload_info["file"]
    
    def download_file(self, file_id: str, output_path: str) -> str:
        """
        Download a file from YukiFiles
        
        Args:
            file_id: ID of the file to download
            output_path: Path where to save the file
            
        Returns:
            Path to the downloaded file
        """
        response = self.session.get(f"{self.base_url}/files/{file_id}/download")
        response.raise_for_status()
        
        with open(output_path, 'wb') as file:
            file.write(response.content)
        
        return output_path
    
    def list_files(self, limit: int = 50, offset: int = 0) -> List[Dict]:
        """
        List user's files
        
        Args:
            limit: Maximum number of files to return
            offset: Number of files to skip
            
        Returns:
            List of file objects
        """
        params = {"limit": limit, "offset": offset}
        response = self.session.get(f"{self.base_url}/files", params=params)
        response.raise_for_status()
        
        return response.json()["data"]["files"]
    
    def get_file_info(self, file_id: str) -> Dict:
        """
        Get detailed information about a file
        
        Args:
            file_id: ID of the file
            
        Returns:
            File information
        """
        response = self.session.get(f"{self.base_url}/files/{file_id}")
        response.raise_for_status()
        
        return response.json()["data"]
    
    def update_file(self, file_id: str, name: str = None, description: str = None) -> Dict:
        """
        Update file metadata
        
        Args:
            file_id: ID of the file to update
            name: New file name
            description: New description
            
        Returns:
            Updated file information
        """
        update_data = {}
        if name:
            update_data["name"] = name
        if description:
            update_data["description"] = description
        
        response = self.session.put(f"{self.base_url}/files/{file_id}", json=update_data)
        response.raise_for_status()
        
        return response.json()["data"]
    
    def delete_file(self, file_id: str) -> bool:
        """
        Delete a file
        
        Args:
            file_id: ID of the file to delete
            
        Returns:
            True if successful
        """
        response = self.session.delete(f"{self.base_url}/files/{file_id}")
        response.raise_for_status()
        
        return True
    
    def create_share_link(self, file_id: str, expires_in: str = "7d", password: str = None) -> Dict:
        """
        Create a shareable link for a file
        
        Args:
            file_id: ID of the file to share
            expires_in: Link expiration time (e.g., "7d", "24h")
            password: Optional password protection
            
        Returns:
            Share link information
        """
        share_data = {"expires_in": expires_in}
        if password:
            share_data["password"] = password
        
        response = self.session.post(f"{self.base_url}/files/{file_id}/share", json=share_data)
        response.raise_for_status()
        
        return response.json()["data"]
    
    def search_files(self, query: str, file_type: str = None, min_size: int = None, max_size: int = None) -> List[Dict]:
        """
        Search for files
        
        Args:
            query: Search query
            file_type: Filter by file type
            min_size: Minimum file size in bytes
            max_size: Maximum file size in bytes
            
        Returns:
            List of matching files
        """
        params = {"q": query}
        if file_type:
            params["type"] = file_type
        if min_size:
            params["min_size"] = min_size
        if max_size:
            params["max_size"] = max_size
        
        response = self.session.get(f"{self.base_url}/files/search", params=params)
        response.raise_for_status()
        
        return response.json()["data"]["files"]
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of a file"""
        hash_sha256 = hashlib.sha256()
        with open(file_path, "rb") as file:
            for chunk in iter(lambda: file.read(4096), b""):
                hash_sha256.update(chunk)
        return hash_sha256.hexdigest()

def main():
    """Example usage of YukiFiles Python client"""
    
    # Initialize client
    api_key = os.getenv("YUKIFILES_API_KEY")
    if not api_key:
        print("Please set YUKIFILES_API_KEY environment variable")
        return
    
    client = YukiFilesClient(api_key)
    
    try:
        # List files
        print("Listing files...")
        files = client.list_files(limit=10)
        print(f"Found {len(files)} files")
        
        for file in files:
            print(f"- {file['name']} ({file['size']} bytes)")
        
        # Search for specific files
        print("\nSearching for text files...")
        text_files = client.search_files("document", file_type="text/plain")
        print(f"Found {len(text_files)} text files")
        
        # Example: Upload a file
        # test_file_path = "test.txt"
        # with open(test_file_path, "w") as f:
        #     f.write("This is a test file for YukiFiles")
        # 
        # print(f"\nUploading {test_file_path}...")
        # uploaded_file = client.upload_file(test_file_path, "Test file for Python integration")
        # print(f"Uploaded file ID: {uploaded_file['id']}")
        
        # Example: Create share link
        if files:
            first_file = files[0]
            print(f"\nCreating share link for {first_file['name']}...")
            share_info = client.create_share_link(first_file['id'], expires_in="24h")
            print(f"Share URL: {share_info['url']}")
        
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()