from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/blogging_platform"
    PORT: int = 4900
    JWT_SECRET: str = "12345678"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_SECONDS: int = 3600
    AUTH_EMAIL: str = "user@gmail.com"
    AUTH_PASSWORD: str = "12345"
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
