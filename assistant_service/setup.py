import os
import sys

def setup_groq_api():
    """Interactive setup for Groq API key"""
    print("🤖 Groq API Key Setup")
    print("=" * 50)
    print("1. Go to https://console.groq.com/")
    print("2. Sign up/Login and get your API key")
    print("3. Copy the API key (starts with 'gsk_')")
    print()
    
    api_key = input("Enter your Groq API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided. Exiting.")
        return False
    
    if not api_key.startswith('gsk_'):
        print("⚠️  Warning: API key should start with 'gsk_'")
        confirm = input("Continue anyway? (y/n): ").lower()
        if confirm != 'y':
            return False
    
    # Set environment variable for current session
    os.environ['GROQ_API_KEY'] = api_key
    
    # Create .env file for future use
    with open('.env', 'w') as f:
        f.write(f"GROQ_API_KEY={api_key}\n")
    
    print("✅ API key set successfully!")
    print("📝 Saved to .env file for future use")
    return True

if __name__ == "__main__":
    setup_groq_api()
