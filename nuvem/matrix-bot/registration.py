from dotenv import load_dotenv
import os
import requests
import hmac, hashlib

load_dotenv()


class BotRegistration:
    """
    Handles the registration of a bot user on a Matrix server using a shared secret.
    Based on Synapse's shared secret registration mechanism:
    https://element-hq.github.io/synapse/latest/admin_api/register_api.html
    """

    def __init__(self):
        """Initialize the BotRegistration with environment variables."""

        self.matrix_url = os.getenv(
            "MATRIX_URL", default="https://matrix.feira-de-jogos.dev.br"
        )
        self.matrix_register_resource = os.getenv(
            "MATRIX_REGISTER_RESOURCE", default="/_synapse/admin/v1/register"
        )

        self.matrix_shared_secret = os.getenv("REGISTRATION_SHARED_SECRET", default="")
        if not self.matrix_shared_secret:
            print("REGISTRATION_SHARED_SECRET is not set. Exiting.")
            exit(1)

        self.bot_username = os.getenv("BOT_USERNAME", default="admin-bot-0")
        self.bot_displayname = os.getenv("BOT_DISPLAYNAME", default="Admin Bot 0")
        self.bot_admin = os.getenv("BOT_ADMIN", default="true").lower() == "true"
        self.bot_user_type = os.getenv("BOT_USER_TYPE", default=None)

        self.bot_password = os.getenv("BOT_PASSWORD", default="")
        if not self.bot_password:
            print("BOT_PASSWORD is not set. Exiting.")
            exit(1)

    def fetch_nonce(self):
        """Fetch a nonce from the Matrix server for registration."""

        uri = "".join([self.matrix_url, self.matrix_register_resource])
        headers = {"Content-Type": "application/json"}
        response = requests.get(uri, headers=headers)

        if response.status_code == 200:
            data = response.json()
            nonce = data.get("nonce")
            return nonce
        else:
            return None

    def generate_mac(self, nonce):
        """Generate the HMAC for registration using the shared secret and nonce."""

        mac = hmac.new(
            key=self.matrix_shared_secret.encode("utf-8"),
            digestmod=hashlib.sha1,
        )

        mac.update(nonce.encode("utf8"))
        mac.update(b"\x00")
        mac.update(self.bot_username.encode("utf8"))
        mac.update(b"\x00")
        mac.update(self.bot_password.encode("utf8"))
        mac.update(b"\x00")
        mac.update(b"admin" if self.bot_admin else b"notadmin")

        if self.bot_user_type:
            mac.update(b"\x00")
            mac.update(self.bot_user_type.encode("utf8"))

        return mac.hexdigest()

    def register(self, nonce):
        """Register the bot user on the Matrix server using the nonce and generated MAC."""
        
        uri = "".join([self.matrix_url, self.matrix_register_resource])
        headers = {"Content-Type": "application/json"}
        payload = {
            "nonce": nonce,
            "username": self.bot_username,
            "displayname": self.bot_displayname,
            "password": self.bot_password,
            "admin": self.bot_admin,
            "mac": self.generate_mac(nonce),
        }

        response = requests.post(uri, json=payload, headers=headers)

        if response.status_code == 200:
            print("Bot registered successfully.")
        else:
            print("Failed to register bot:", response.text)
