from registration import BotRegistration

if __name__ == "__main__":
    """Main entry point for the bot registration script."""
    
    bot = BotRegistration()

    nonce = bot.fetch_nonce()
    if nonce:
        bot.register(nonce)
    else:
        print("Failed to fetch nonce. Exiting.")

