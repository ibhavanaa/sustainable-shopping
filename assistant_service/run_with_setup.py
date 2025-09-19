#!/usr/bin/env python3
"""
Setup and run the AI Assistant service with Groq API key configuration
"""
import os
import sys
import subprocess

def setup_and_run():
    print("🤖 AI Assistant Service Setup")
    print("=" * 50)
    
    # Check if .env file exists
    if os.path.exists('.env'):
        print("✅ Found existing .env file")
        with open('.env', 'r') as f:
            content = f.read()
            if 'GROQ_API_KEY=' in content:
                print("✅ Groq API key found in .env file")
            else:
                print("⚠️  No GROQ_API_KEY found in .env file")
                setup_api_key()
    else:
        print("📝 No .env file found, setting up...")
        setup_api_key()
    
    # Check if CSV file exists
    if not os.path.exists('finalwebsite.csv'):
        print("📁 Copying CSV file...")
        try:
            import shutil
            shutil.copy('../backend/data/finalwebsite.csv', 'finalwebsite.csv')
            print("✅ CSV file copied successfully")
        except Exception as e:
            print(f"❌ Failed to copy CSV file: {e}")
            print("Please ensure the CSV file exists at ../backend/data/finalwebsite.csv")
            return
    
    # Start the service
    print("\n🚀 Starting AI Assistant service...")
    print("Service will be available at: http://localhost:5002")
    print("Health check: http://localhost:5002/health")
    print("\nPress Ctrl+C to stop the service")
    print("-" * 50)
    
    try:
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\n👋 Service stopped by user")
    except Exception as e:
        print(f"❌ Error starting service: {e}")

def setup_api_key():
    """Interactive API key setup"""
    print("\n🔑 Groq API Key Setup")
    print("1. Go to https://console.groq.com/")
    print("2. Sign up/Login and get your API key")
    print("3. Copy the API key (starts with 'gsk_')")
    print()
    
    api_key = input("Enter your Groq API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided. Service will run in fallback mode.")
        return
    
    if not api_key.startswith('gsk_'):
        print("⚠️  Warning: API key should start with 'gsk_'")
        confirm = input("Continue anyway? (y/n): ").lower()
        if confirm != 'y':
            print("❌ Setup cancelled")
            return
    
    # Create .env file
    with open('.env', 'w') as f:
        f.write(f"GROQ_API_KEY={api_key}\n")
    
    print("✅ API key saved to .env file")
    
    # Set environment variable for current session
    os.environ['GROQ_API_KEY'] = api_key
    print("✅ API key set for current session")

if __name__ == "__main__":
    setup_and_run()
