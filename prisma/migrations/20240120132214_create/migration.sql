-- AlterTable
ALTER TABLE "players" ALTER COLUMN "exp" SET DEFAULT 0,
ALTER COLUMN "play_count" SET DEFAULT 0,
ALTER COLUMN "play_token" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "exp" SET DEFAULT 0;
